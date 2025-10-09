from pathlib import Path
from django.utils.translation import gettext_lazy as _
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

STORAGE_FOLDER = BASE_DIR / 'storage'

SECRET_KEY = config("SECRET_KEY")

DEBUG = config("DEBUG", cast=bool)

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'evolutionofants.click'
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost',
    'http://127.0.0.1',
    'https://evolutionofants.click'
]

MAIN_SOCKET_URL = '/mainsocket'

# Application definition

INSTALLED_APPS = [
    'daphne',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'client.apps.ClientConfig',
    'infrastructure.apps.InfrastructureConfig',
    'main.apps.MainConfig'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "django.middleware.locale.LocaleMiddleware",
    'infrastructure.middlewares.customLocalMiddleware.CustomLocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'infrastructure.middlewares.httpRequestErrorsHandlerMiddleware.HttpRequestErrorsHandlerMiddleware'
]

ROOT_URLCONF = 'bugs.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'bugs.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': STORAGE_FOLDER / 'db/db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 6,
        },
    },
    {
        "NAME": "infrastructure.validators.password_max_length_validator.PasswordMaxLengthValidator",
        "OPTIONS": {
            "max_length": 100,
        }
    }
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

# LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

LANGUAGE_CODE = 'en'
USE_I18N = True
USE_L10N = True
LOCALE_PATHS = [
    BASE_DIR / 'locale'
]
LANGUAGES = [
    ('en', _('English')),
    ('uk', _('Українська')),
]


STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'client/static'
BACKUP_FOLDER = STORAGE_FOLDER / 'backups'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

ASGI_APPLICATION = 'bugs.asgi.application'

LOGIN_URL = '/account'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'djangon_file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': STORAGE_FOLDER / 'logs/django_errors.log',
            'formatter': 'detailed',
        },
        "console": {
            "class": "logging.StreamHandler",
            'level': 'INFO',
            'formatter': 'detailed',
        }
    },
    'formatters': {
        'detailed': {
            'format': '%(asctime)s %(levelname)s: %(message)s',
        },
    },
    'loggers': {
        "django.request": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
        'django_logger': {
            'handlers': ['console', 'djangon_file'],
            'level': 'DEBUG',
            'propagate': False,
        }
    },
}

GOOGLE_CLIENT_ID=config("GOOGLE_CLIENT_ID")
GOOGLE_OAUTH_REDIRECT_URI = config("GOOGLE_OAUTH_REDIRECT_URI")

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = "Evolution Of Ants <your-email@gmail.com>"
USER_MAILS_DAY_LIMIT = 30

AUTH_USER_MODEL = 'infrastructure.User'
AUTHENTICATION_BACKENDS = [
    'infrastructure.email_authentication_backend.EmailBackend'
]

WORLD_ID = config("WORLD_ID", cast=int)

RATING_GENERATION_PERIOD = 3600
WORLD_BACKUP_PERIOD = 3610