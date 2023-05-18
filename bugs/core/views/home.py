from django.shortcuts import render
from django.templatetags.static import static
from core.world.settings import STEP_TIME

def index(request):

    initial_data = {
        'user': request.user.get_general_data() if request.user.is_authenticated else None,
        'urls': {
            'world_spritesheet': static('core/textures/world_spritesheet.png'),
            'world_spritesheet_atlas': static('core/textures/world_spritesheet.json'),
        },
        'step_time': STEP_TIME
    }
    
    return render(request, 'core/home.html', {'initial_data': initial_data})