from django.http import HttpResponse, JsonResponse, HttpRequest
from infrastructure.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_POST
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie
from bugs.settings import GOOGLE_CLIENT_ID, GOOGLE_OAUTH_REDIRECT_URI
from django.views.decorators.csrf import csrf_exempt
from google.oauth2 import id_token
from google.auth.transport import requests
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
import json

@ensure_csrf_cookie
def account_index(request: HttpRequest):
    return render(request, 'client/account.html', {
        'google_client_id': GOOGLE_CLIENT_ID,
        'google_oauth_redirect_uri': GOOGLE_OAUTH_REDIRECT_URI
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

        user, created = User.objects.get_or_create(username=user_email)

        if created:
            user.set_unusable_password()
            user.save()

        login(request, user)

        return redirect('game_index')

@require_POST 
def check_username_uniqueness(request):
    try:
        username = request.json['username']
    except Exception as e:
        return HttpResponse(status=400)

    is_unique = not User.objects.filter(username=username).exists()

    return JsonResponse({
        'is_unique': is_unique
    })

@require_POST 
def check_email_uniqueness(request):
    try:
        email = request.json['email']
    except Exception as e:
        return HttpResponse(status=400)

    is_unique = not User.objects.filter(email=email).exists()

    return JsonResponse({
        'is_unique': is_unique
    })
    
@require_POST        
def account_register(request: HttpRequest):
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not username or not email or not password:
            return HttpResponse(status=400)
    except Exception:
        return HttpResponse(status=400)

    try:
        user = User(username=username, email=email)
        user.set_password(password)
        user.full_clean()
        user.save()

        login(request, user)
        
        return JsonResponse({
            'user': user.get_general_data()
        })
    except ValidationError as e:
        return HttpResponse(status=409)

@require_POST    
def account_login(request: HttpRequest):
    try:
        data = json.loads(request.body)
        username = data.get('username', '')
        password = data.get('password', '')
        if not username or not password:
            return HttpResponse(status=400)
    except Exception as e:
        return HttpResponse(status=400)
    
    user = authenticate(username=username, password=password)

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
def account_change_name(request):
    username = request.json['username']
    user = User.objects.get(id=request.user.id)
    user.username = username
    user.full_clean()  # Викличе валідацію
    user.save()
    return JsonResponse({
            'user': user.get_general_data()
        })