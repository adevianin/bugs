from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
from django.http.request import HttpRequest
from bugs.settings import MAIN_SOCKET_URL
from core.world.world_facade import WorldFacade

@ensure_csrf_cookie
@login_required
def index(request: HttpRequest):
    wf = WorldFacade.get_instance()
    if not wf.is_world_running:
        return render(request, 'client/maintenance.html')

    initial_data = {
        'user': request.user.get_general_data(),
        'mainSocketURL': MAIN_SOCKET_URL
    }
    
    return render(request, 'client/game.html', {'initial_data': initial_data})
