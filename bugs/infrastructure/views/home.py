from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http.request import HttpRequest
from bugs.settings import MAIN_SOCKET_URL

@ensure_csrf_cookie
def index(request: HttpRequest):

    initial_data = {
        'user': request.user.get_general_data() if request.user.is_authenticated else None,
        'mainSocketURL': MAIN_SOCKET_URL
    }
    
    return render(request, 'client/home.html', {'initial_data': initial_data})
