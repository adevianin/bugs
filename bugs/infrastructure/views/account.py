from django.http import HttpResponse, JsonResponse, HttpRequest
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_POST, require_GET
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from bugs.settings import GOOGLE_CLIENT_ID, GOOGLE_OAUTH_REDIRECT_URI
from django.contrib.auth.decorators import login_required
from infrastructure.utils.build_base_url import build_base_url
from django.contrib.auth import update_session_auth_hash
from infrastructure.services.providers import get_account_service
from infrastructure.exceptions import (IncorrectPasswordException, IncorrectNewPasswordException, SocialAccountException, UserDoesNotExistException, 
                                       EmailTakenException, EmailFormatException, UsernameTakenException, UsernameFormatException, Base64DecodingException, 
                                       InvalidTokenException, InvalidAccountException)
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
    token = request.POST.get('credential')
    
    acc_serv = get_account_service()
    user = acc_serv.google_auth(post_csrf_token, cookie_csrf_token, token)

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
    
    acc_serv = get_account_service()
    try:
        user = acc_serv.account_register(username, email, password, build_base_url(request))
    except (UsernameTakenException, EmailTakenException):
        return HttpResponse(status=409)
    except (IncorrectNewPasswordException, InvalidAccountException):
        return HttpResponse(status=400)
    
    login(request, user)
        
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
def check_username_uniqueness(request: HttpRequest):
    try:
        data = json.loads(request.body)
        username = data.get('username', '')
        if not username:
            return HttpResponse(status=400)
    except Exception as e:
        return HttpResponse(status=400)

    acc_serv = get_account_service()
    is_unique = acc_serv.check_username_uniqueness(username)

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

    acc_serv = get_account_service()
    is_unique = acc_serv.check_email_uniqueness(email)

    return JsonResponse({
        'is_unique': is_unique
    })

@require_GET
def verify_email(request, uidb64, token):
    acc_serv = get_account_service()
    is_success = acc_serv.verify_email(uidb64, token)

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
    
    acc_serv = get_account_service()
    acc_serv.reset_password_request(email, build_base_url(request))
    
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
    
    acc_serv = get_account_service()
    try:
        acc_serv.set_new_password(new_password, base64Id, token)
    except (Base64DecodingException, UserDoesNotExistException, SocialAccountException, IncorrectNewPasswordException):
        return HttpResponse(status=400)
    except InvalidTokenException:
        return HttpResponse(status=403)
    
    return HttpResponse(status=204)

@require_POST
@login_required
def change_username(request: HttpRequest):
    try:
        data = json.loads(request.body)
        new_username = data.get('newUsername', '')
        if not new_username:
            return HttpResponse(status=400)
    except Exception as e:
        return HttpResponse(status=400)
    
    acc_serv = get_account_service()
    try:
        user = acc_serv.change_username(request.user.id, new_username)
    except UserDoesNotExistException:
        return HttpResponse(status=400)
    except UsernameFormatException:
        return HttpResponse(status=400)
    except UsernameTakenException:
        return HttpResponse(status=409)
    
    return JsonResponse({
        'user': user.get_general_data()
    }, status=200)  
   
@require_POST
@login_required
def change_email(request: HttpRequest):
    try:
        data = json.loads(request.body)
        new_email = data.get('newEmail', '')
        password = data.get('password', '')
    except Exception as e:
        return HttpResponse(status=400)
    
    acc_serv = get_account_service()
    try:
        user = acc_serv.change_email(request.user.id, new_email, password, build_base_url(request))
    except UserDoesNotExistException:
        return HttpResponse(status=400)
    except SocialAccountException:
        return HttpResponse(status=400)
    except IncorrectPasswordException:
        return HttpResponse(status=401)
    except EmailFormatException:
        return HttpResponse(status=400)
    except EmailTakenException:
        return HttpResponse(status=409)

    return JsonResponse({
        'user': user.get_general_data()
    }, status=200)    

@require_POST
@login_required
def change_password(request: HttpRequest):
    try:
        data = json.loads(request.body)
        old_password = data.get('oldPassword', '')
        new_password = data.get('newPassword', '')
    except Exception as e:
        return HttpResponse(status=400)
    
    acc_serv = get_account_service()
    try:
        user = acc_serv.change_password(request.user.id, old_password, new_password)
        update_session_auth_hash(request, user)
    except UserDoesNotExistException:
        return HttpResponse(status=400)
    except IncorrectPasswordException:
        return HttpResponse(status=401)
    except SocialAccountException:
        return HttpResponse(status=400)
    except IncorrectNewPasswordException:
        return HttpResponse(status=400)
                
    return HttpResponse(status=204)   
 
@require_POST
@login_required
def verify_email_request(request: HttpRequest):
    acc_serv = get_account_service()
    acc_serv.verify_email_request(request.user.id, build_base_url(request))

    return HttpResponse(status=204)    