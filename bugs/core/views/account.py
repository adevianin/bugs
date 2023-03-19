from django.http import HttpResponse, JsonResponse
from django.views import View
from core.models import User
from django.contrib.auth import authenticate, login, logout

class UsernameUniqueCheckView(View):
    def post(self, request): 
        username = request.json['username']

        is_unique = not User.objects.filter(username=username).exists()

        return JsonResponse({
            'is_unique': is_unique
        })
    
class UserRegistrationView(View):
    def post(self, request):
        username = request.json['username']
        password = request.json['password']

        try:
            User.objects.create_user(username, password=password)
            return HttpResponse(status=200)
        except:
            return HttpResponse(status=500)
        
class UserLoginView(View):
    def post(self, request):
        username = request.json['username']
        password = request.json['password']

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({
                'user': user.get_general_data()
            })
        else:
            return HttpResponse(status=401)
        
class UserLogoutView(View):
    def post(self, request):
        logout(request)
        return HttpResponse(status=200)