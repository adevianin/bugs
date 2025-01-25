from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http.request import HttpRequest

@ensure_csrf_cookie
def index(request: HttpRequest):

    initial_data = {
        'user': request.user.get_general_data() if request.user.is_authenticated else None
    }
    
    return render(request, 'client/home.html', {'initial_data': initial_data})
