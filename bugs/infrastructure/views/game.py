from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
from django.http.request import HttpRequest
from bugs.settings import MAIN_SOCKET_URL
from infrastructure.services.providers import get_engine_adapter
from infrastructure.utils.get_user_general_data_async import get_general_data_async

@ensure_csrf_cookie
@login_required
async def index(request: HttpRequest):
    ea = get_engine_adapter()
    if not ea or not await ea.is_game_working:
        return render(request, 'client/maintenance.html')
    
    ws_protocol = 'wss' if request.is_secure() else 'ws'
    host = request.get_host()
    full_socket_url = f'{ws_protocol}://{host}{MAIN_SOCKET_URL}'

    initial_data = {
        'user': await get_general_data_async(request.user),
        'mainSocketURL': full_socket_url
    }
    
    return render(request, 'client/game.html', {'initial_data': initial_data})
