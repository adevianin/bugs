from django.core.exceptions import ValidationError

class PasswordMaxLengthValidator:
    def __init__(self, max_length):
        self.max_length = max_length

    def validate(self, password, user=None):
        if len(password) > self.max_length:
            raise ValidationError(
                f"Password cannot be longer than {self.max_length} characters.",
                code='password_too_long',
            )

    def get_help_text(self):
        return f"Password cannot be longer than {self.max_length} characters."
