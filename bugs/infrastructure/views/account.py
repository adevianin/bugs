from django.http import HttpResponse, JsonResponse, HttpRequest
from infrastructure.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_POST
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def account_index(request: HttpRequest):
    return render(request, 'client/account.html')

@require_POST 
def account_check_name(request):
    try:
        username = request.json['username']
    except Exception as e:
        return HttpResponse(status=400)

    is_unique = not User.objects.filter(username=username).exists()

    return JsonResponse({
        'is_unique': is_unique
    })
    
@require_POST        
def account_register(request):
    try:
        username = request.json['username']
        password = request.json['password']
    except Exception as e:
        return HttpResponse(status=400)

    try:
        user = User.objects.create_user(username, password=password)
        login(request, user)
        
        return JsonResponse({
            'user': user.get_general_data()
        })
    except:
        return HttpResponse(status=500)

@require_POST    
def account_login(request):
    try:
        username = request.json['username']
        password = request.json['password']
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
        