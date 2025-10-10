from django.shortcuts import render

async def theft2_index(request):
    return render(request, 'client/theft2_mini_game.html')