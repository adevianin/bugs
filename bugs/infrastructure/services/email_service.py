from infrastructure.models import User
from infrastructure.token_generators.email_verification_token_generator import EmailVerificationTokenGenerator
from infrastructure.token_generators.reset_password_token_generator import ResetPasswordTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from bugs.settings import DEFAULT_FROM_EMAIL, USER_MAILS_DAY_LIMIT
from django.utils.encoding import force_bytes
from urllib.parse import urlencode
from collections import defaultdict
from infrastructure.exceptions import DailyEmailLimitExceededException
from django.utils.translation import gettext_lazy as _
import time

class EmailService:
    def __init__(self):
        self.email_send_count = defaultdict(lambda: {'count': 0, 'reset_time': time.time() + 86400})

    def can_send_email(self, user: User):
        user_data = self.email_send_count[user.id]
        current_time = time.time()

        if current_time > user_data['reset_time']:
            del self.email_send_count[user.id]
            user_data = self.email_send_count[user.id]

        if user_data['count'] >= USER_MAILS_DAY_LIMIT:
            return False

        return True

    def increment_email_count(self, user: User):
        self.email_send_count[user.id]['count'] += 1

    def send_verification_email(self, user: User, base_url: str):
        if not self.can_send_email(user):
            raise DailyEmailLimitExceededException(f'user id = {user.id}')
        
        subject = _('Verifying your account')
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = EmailVerificationTokenGenerator.generate(user)
        relative_link = reverse('verify_email', kwargs={'uidb64': uid, 'token': token})
        verification_link = f'{base_url}{relative_link}'
        
        html_message = render_to_string('infrastructure/emails/verify_email.html', {
            'user': user,
            'verification_link': verification_link,
        })
        
        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        email.content_subtype = 'html'
        email.send()

        self.increment_email_count(user)

    def send_reset_password_email(self, user: User, base_url: str):
        if not self.can_send_email(user):
            raise DailyEmailLimitExceededException(f'user id = {user.id}')
        
        subject = _('Password recovery')
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = ResetPasswordTokenGenerator.generate(user)
        relative_link = reverse('reset_password')
        params = {'i': uid, 't': token}
        full_link = f'{base_url}{relative_link}?{urlencode(params)}'
        
        html_message = render_to_string('infrastructure/emails/password_reset.html', {
            'user': user,
            'reset_password_link': full_link,
        })
        
        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        email.content_subtype = 'html'
        email.send()

        self.increment_email_count(user)