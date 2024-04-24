from django.shortcuts import render

def index(request):

    initial_data = {
        'user': request.user.get_general_data() if request.user.is_authenticated else None
    }
    
    return render(request, 'core/home.html', {'initial_data': initial_data})
