from infrastructure.models import User
from infrastructure.token_generators.email_verification_token_generator import EmailVerificationTokenGenerator
from infrastructure.token_generators.reset_password_token_generator import ResetPasswordTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from bugs.settings import DEFAULT_FROM_EMAIL
from django.utils.encoding import force_bytes
from urllib.parse import urlencode

class EmailService():

    @staticmethod
    def send_verification_email(user: User, base_url: str):
        subject = 'Підтвердження вашого облікового запису'
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

    @staticmethod
    def send_reset_password_email(user: User, base_url: str):
        subject = 'Відновлення пароля'
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