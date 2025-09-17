from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
from django.http.request import HttpRequest
from bugs.settings import MAIN_SOCKET_URL, DEBUG
from infrastructure.engine.engine_adapter import EngineAdapter

@ensure_csrf_cookie
@login_required
def index(request: HttpRequest):
    ea = EngineAdapter.get_instance()
    if not ea.is_game_working:
        return render(request, 'client/maintenance.html')
    
    ws_protocol = 'ws' if DEBUG else 'wss'
    host = request.get_host()
    full_socket_url = f'{ws_protocol}://{host}{MAIN_SOCKET_URL}'

    initial_data = {
        'user': request.user.get_general_data(),
        'mainSocketURL': full_socket_url
    }
    
    return render(request, 'client/game.html', {'initial_data': initial_data})
