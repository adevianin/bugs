from infrastructure.models import User
from .email_service import EmailService
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from infrastructure.token_generators.reset_password_token_generator import ResetPasswordTokenGenerator
from infrastructure.token_generators.email_verification_token_generator import EmailVerificationTokenGenerator
from django.utils.http import urlsafe_base64_decode
from infrastructure.exceptions import (IncorrectPasswordException, IncorrectNewPasswordException, SocialAccountException, UserDoesNotExistException, 
                                       EmailTakenException, EmailFormatException, UsernameTakenException, UsernameFormatException, Base64DecodingException, 
                                       InvalidTokenException, DailyEmailLimitExceededException, InvalidAccountException, GoogleAuthException)
from infrastructure.event_bus import EventBus
from google.oauth2 import id_token
from google.auth.transport import requests
from bugs.settings import GOOGLE_CLIENT_ID
from infrastructure.utils.generate_username import generate_username
from django.db import IntegrityError

class AccountService():

    def __init__(self, event_bus: EventBus, email_service: EmailService):
        self._event_bus = event_bus
        self._email_service = email_service

    def google_auth(self, post_csrf_token: str, cookie_csrf_token: str, token: str) -> User:
        if post_csrf_token != cookie_csrf_token:
            raise GoogleAuthException('g_csrf_token is not valid')
        
        if not token:
            raise GoogleAuthException('token is missing')
        
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        if idinfo['aud'] != GOOGLE_CLIENT_ID:
            raise GoogleAuthException('invalid client id')

        user_email = idinfo.get('email')

        user, created = User.objects.get_or_create(email=user_email)

        if created:
            user.username = generate_username()
            user.is_email_verified = True
            user.set_unusable_password()
            user.save()

        return user

    def account_register(self, username: str, email: str, password: str, base_url: str) -> User:
        if User.objects.filter(username=username).exists():
            raise UsernameTakenException()
        
        if User.objects.filter(email=email).exists():
            raise EmailTakenException()

        user = User(username=username, email=email)

        try:
            validate_password(password, user=user)
            user.set_password(password)
        except ValidationError as e:
            raise IncorrectNewPasswordException()
        
        try:
            user.full_clean()
            user.save()
        except ValidationError:
            raise InvalidAccountException()
        
        try:
            self._email_service.send_verification_email(user, base_url)
        except DailyEmailLimitExceededException:
            pass

        return user

    def check_username_uniqueness(self, username: str):
        is_unique = not User.objects.filter(username=username).exists()
        return is_unique
    
    def check_email_uniqueness(self, email: str):
        is_unique = not User.objects.filter(email=email).exists()
        return is_unique
    
    def verify_email(self, uidb64: str, token: str) -> bool:
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        is_success = None
        if user and EmailVerificationTokenGenerator.validate(user, token):
            user.is_email_verified = True
            user.save()
            self._event_bus.emit('email_verified', user)
            is_success = True
        else:
            is_success = False

        return is_success
    
    def reset_password_request(self, email: str, base_url: str):
        try:
            user = User.objects.get(email=email)
            if user.has_usable_password():
                try: 
                    self._email_service.send_reset_password_email(user, base_url)
                except DailyEmailLimitExceededException:
                    return
        except User.DoesNotExist:
            return
    
    def set_new_password(self, new_password: str, base64Id: str, token: str):
        try:
            id = urlsafe_base64_decode(base64Id).decode()
        except (TypeError, ValueError, OverflowError):
            raise Base64DecodingException()
        
        try:
            user = User.objects.get(pk=id)
        except User.DoesNotExist:
            raise UserDoesNotExistException()

        if not ResetPasswordTokenGenerator.validate(user, token):
            raise InvalidTokenException()
        
        if user.is_social_account():
            raise SocialAccountException() 
        
        try:
            validate_password(new_password, user=user)
        except ValidationError as e:
            raise IncorrectNewPasswordException()
        
        user.set_password(new_password)
        user.save()
    
    def change_username(self, user_id: int, new_username: str) -> User:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise UserDoesNotExistException()
        
        try:
            user.username = new_username
            user.full_clean()
        except ValidationError as e:
            for error in e.error_dict.get('username', []):
                if error.code == 'unique':
                    raise UsernameTakenException()
                else:
                    raise UsernameFormatException()
                
        try:
            user.save()
            return user
        except IntegrityError as e:
            raise UsernameTakenException()
    
    def change_email(self, user_id: int, new_email: str, password: str, base_url: str) -> User:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise UserDoesNotExistException()
        
        if user.is_social_account():
            raise SocialAccountException()
        
        if not user.check_password(password):
            raise IncorrectPasswordException()
        
        try:
            is_email_diff = user.email != new_email
            if is_email_diff:
                user.is_email_verified = False
            user.email = new_email
            user.full_clean()
        except ValidationError as e:
            for error in e.error_dict.get('email', []):
                if error.code == 'unique':
                    raise EmailTakenException()
                else:
                    raise EmailFormatException()
                
        try:
            user.save()
        except IntegrityError:
            raise EmailTakenException()
        
        if is_email_diff:
            try:
                self._email_service.send_verification_email(user, base_url)
            except DailyEmailLimitExceededException:
                pass
            
        return user

    def change_password(self, user_id: int, old_pass: str, new_pass: str) -> User:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise UserDoesNotExistException()
        
        if user.is_social_account():
            raise SocialAccountException()
        
        if not user.check_password(old_pass):
            raise IncorrectPasswordException()
        
        try:
            validate_password(new_pass, user=user)
            user.set_password(new_pass)
            user.full_clean()
            user.save()

            return user
        except ValidationError as e:
            raise IncorrectNewPasswordException()
    
    def verify_email_request(self, user_id: int, base_url: str):
        user = User.objects.get(id=user_id)

        if not user.is_email_verified:
            try:
                self._email_service.send_verification_email(user, base_url)
            except DailyEmailLimitExceededException:
                return
