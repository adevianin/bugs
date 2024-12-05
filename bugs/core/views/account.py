from django.http import HttpResponse, JsonResponse
from core.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_POST
from core.world.world_facade import WorldFacade

@require_POST 
def check_username(request):
    try:
        username = request.json['username']
    except Exception as e:
        return HttpResponse(status=400)

    is_unique = not User.objects.filter(username=username).exists()

    return JsonResponse({
        'is_unique': is_unique
    })
    
@require_POST        
def user_register(request):
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
def user_login(request):
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
def user_logout(request):
    logout(request)
    return HttpResponse(status=200)
        