from django.http import HttpResponse, JsonResponse, HttpRequest
from infrastructure.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_POST, require_GET
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from bugs.settings import GOOGLE_CLIENT_ID, GOOGLE_OAUTH_REDIRECT_URI
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.utils.http import urlsafe_base64_decode
from infrastructure.token_generators.email_verification_token_generator import EmailVerificationTokenGenerator
from infrastructure.token_generators.reset_password_token_generator import ResetPasswordTokenGenerator
from django.contrib.auth.password_validation import validate_password
from infrastructure.email.email_service import EmailService
from infrastructure.utils.build_base_url import build_base_url
from infrastructure.utils.generate_username import generate_username
import json

@ensure_csrf_cookie
def account_index(request: HttpRequest):
    return render(request, 'client/account/index.html', {
        'google_client_id': GOOGLE_CLIENT_ID,
        'google_oauth_redirect_uri': GOOGLE_OAUTH_REDIRECT_URI
    })

@ensure_csrf_cookie
def reset_password(request: HttpRequest):
    token = request.GET.get('t') 
    return render(request, 'client/account/reset_password.html', {
        "is_set_password_mode": bool(token),
        "is_request_mode": not bool(token),
    })

@csrf_exempt
@require_POST
def google_auth_callback(request: HttpRequest):
        post_csrf_token = request.POST.get("g_csrf_token")
        cookie_csrf_token = request.COOKIES.get("g_csrf_token")
        
        if post_csrf_token != cookie_csrf_token:
            raise Exception('g_csrf_token is not valid')

        token = request.POST.get('credential')
        if not token:
            raise Exception('token is missing')
        
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        if idinfo['aud'] != GOOGLE_CLIENT_ID:
            raise Exception('invalid client id')

        user_email = idinfo.get('email')

        user, created = User.objects.get_or_create(email=user_email)

        if created:
            user.username = generate_username()
            user.is_email_verified = True
            user.set_unusable_password()
            user.save()

        login(request, user)

        return redirect('game_index')

@require_POST        
def account_register(request: HttpRequest):
    try:
        data = json.loads(request.body)
        username = data.get('username', '')
        email = data.get('email', '')
        password = data.get('password', '')
        
        if not username or not email or not password:
            return HttpResponse(status=400)
    except Exception:
        return HttpResponse(status=400)

    if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
        return HttpResponse(status=409)

    user = User(username=username, email=email)

    try:
        validate_password(password, user=user)
        user.set_password(password)
    except ValidationError as e:
        return HttpResponse(status=400)
    
    try:
        user.full_clean()
        user.save()
    except ValidationError:
        return HttpResponse(status=400)
    
    login(request, user)
    EmailService.send_verification_email(user, build_base_url(request))
        
    return JsonResponse({
        'user': user.get_general_data()
    }, status=201)

@require_POST    
def account_login(request: HttpRequest):
    try:
        data = json.loads(request.body)
        email = data.get('email', '')
        password = data.get('password', '')
        if not email or not password:
            return HttpResponse(status=400)
    except Exception as e:
        return HttpResponse(status=400)
    
    user = authenticate(request, email=email, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({
            'user': user.get_general_data()
        })
    else:
        return HttpResponse(status=401)

@require_POST
def account_logout(request):
    logout(request)
    return JsonResponse({
        'redirectUrl': reverse('account_index')
    })

@require_POST
@login_required  
def account_change_name(request: HttpRequest):
    data = json.loads(request.body)
    username = data.get('username', '')
    user = User.objects.get(id=request.user.id)
    user.username = username
    user.full_clean()
    user.save()
    return JsonResponse({
            'user': user.get_general_data()
        })

@require_POST 
def check_username_uniqueness(request: HttpRequest):
    try:
        data = json.loads(request.body)
        username = data.get('username', '')
        if not username:
            return HttpResponse(status=400)
    except Exception as e:
        return HttpResponse(status=400)

    is_unique = not User.objects.filter(username=username).exists()

    return JsonResponse({
        'is_unique': is_unique
    })

@require_POST 
def check_email_uniqueness(request):
    try:
        data = json.loads(request.body)
        email = data.get('email', '')
        if not email:
            return HttpResponse(status=400)
    except Exception as e:
        return HttpResponse(status=400)

    is_unique = not User.objects.filter(email=email).exists()

    return JsonResponse({
        'is_unique': is_unique
    })

@require_GET
def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    is_success = None
    if user and EmailVerificationTokenGenerator.validate(user, token):
        user.is_email_verified = True
        user.save()
        is_success = True
    else:
        is_success = False

    return render(request, 'client/account/email_verification.html', {
        "is_success": is_success
    })

@require_POST 
def reset_password_request(request: HttpRequest):
    try:
        data = json.loads(request.body)
        email = data.get('email', '')
        if not email:
            return HttpResponse(status=400)
    except Exception as e:
        return HttpResponse(status=400)
    
    try:
        user = User.objects.get(email=email)
        if user.has_usable_password():
            EmailService.send_reset_password_email(user, build_base_url(request))
        return HttpResponse(status=204)
    except User.DoesNotExist:
        return HttpResponse(status=204)
    
@require_POST 
def set_new_password(request: HttpRequest):
    try:
        data = json.loads(request.body)
        new_password = data.get('newPassword', '')
        base64Id = data.get('id', '')
        token = data.get('token', '')
        if not new_password or not base64Id or not token:
            return HttpResponse(status=400)
    except Exception as e:
        return HttpResponse(status=400)
    
    try:
        id = urlsafe_base64_decode(base64Id).decode()
        user = User.objects.get(pk=id)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return HttpResponse(status=400)
    
    if not ResetPasswordTokenGenerator.validate(user, token):
        return HttpResponse(status=400)
    
    try:
        validate_password(new_password, user=user)
    except ValidationError as e:
        return HttpResponse(status=400)
    
    user.set_password(new_password)
    user.save()
    
    return HttpResponse(status=204)
