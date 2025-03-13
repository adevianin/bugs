from django.http import HttpResponse, JsonResponse, HttpRequest
from infrastructure.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_POST, require_GET
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from bugs.settings import GOOGLE_CLIENT_ID, GOOGLE_OAUTH_REDIRECT_URI
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from bugs.settings import DEFAULT_FROM_EMAIL
from django.core.mail import EmailMessage
from infrastructure.token_generators.email_verification_token_generator import EmailVerificationToken
import json
import random
import uuid

@ensure_csrf_cookie
def account_index(request: HttpRequest):
    return render(request, 'client/account/index.html', {
        'google_client_id': GOOGLE_CLIENT_ID,
        'google_oauth_redirect_uri': GOOGLE_OAUTH_REDIRECT_URI
    })

@csrf_exempt
@require_POST
def google_auth_callback(request: HttpRequest):
        post_csrf_token = request.POST.get("g_csrf_token")
        cookie_csrf_token = request.COOKIES.get("g_csrf_token")
        
        if post_csrf_token != cookie_csrf_token:
            raise Exception('g_csrf_token is not valid')

        token = request.POST.get('credential')
        if not token:
            raise Exception('token is missing')
        
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        if idinfo['aud'] != GOOGLE_CLIENT_ID:
            raise Exception('invalid client id')

        user_email = idinfo.get('email')

        user, created = User.objects.get_or_create(email=user_email)

        if created:
            user.username = _generate_username()
            user.is_email_verified = True
            user.set_unusable_password()
            user.save()

        login(request, user)

        return redirect('game_index')

@require_POST        
def account_register(request: HttpRequest):
    try:
        data = json.loads(request.body)
        username = data.get('username', '')
        email = data.get('email', '')
        password = data.get('password', '')
        
        if not username or not email or not password:
            return HttpResponse(status=400)
    except Exception:
        return HttpResponse(status=400)

    if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
        return HttpResponse(status=409)

    user = User(username=username, email=email)
    user.set_password(password)
    
    try:
        user.full_clean()
        user.save()
    except ValidationError:
        return HttpResponse(status=400)
    
    login(request, user)
    _send_verification_email(request, user)
        
    return JsonResponse({
        'user': user.get_general_data()
    }, status=201)

@require_POST    
def account_login(request: HttpRequest):
    try:
        data = json.loads(request.body)
        email = data.get('email', '')
        password = data.get('password', '')
        if not email or not password:
            return HttpResponse(status=400)
    except Exception as e:
        return HttpResponse(status=400)
    
    user = authenticate(request, email=email, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({
            'user': user.get_general_data()
        })
    else:
        return HttpResponse(status=401)

@require_POST
def account_logout(request):
    logout(request)
    return JsonResponse({
        'redirectUrl': reverse('account_index')
    })

@require_POST
@login_required  
def account_change_name(request: HttpRequest):
    data = json.loads(request.body)
    username = data.get('username', '')
    user = User.objects.get(id=request.user.id)
    user.username = username
    user.full_clean()
    user.save()
    return JsonResponse({
            'user': user.get_general_data()
        })

@require_POST 
def check_username_uniqueness(request: HttpRequest):
    try:
        data = json.loads(request.body)
        username = data.get('username', '')
        if not username:
            return HttpResponse(status=400)
    except Exception as e:
        return HttpResponse(status=400)

    is_unique = not User.objects.filter(username=username).exists()

    return JsonResponse({
        'is_unique': is_unique
    })

@require_POST 
def check_email_uniqueness(request):
    try:
        data = json.loads(request.body)
        email = data.get('email', '')
        if not email:
            return HttpResponse(status=400)
    except Exception as e:
        return HttpResponse(status=400)

    is_unique = not User.objects.filter(email=email).exists()

    return JsonResponse({
        'is_unique': is_unique
    })

@require_GET
def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    is_success = None
    if user and EmailVerificationToken.validate(user, token):
        user.is_email_verified = True
        user.save()
        is_success = True
    else:
        is_success = False

    return render(request, 'client/account/email_verification.html', {
        "is_success": is_success
    })
    
def _send_verification_email(request: HttpRequest, user: User):
    subject = 'Підтвердження вашого облікового запису'
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = EmailVerificationToken.generate(user)
    relative_link = reverse('verify_email', kwargs={'uidb64': uid, 'token': token})
    verification_link = request.build_absolute_uri(relative_link)
    
    html_message = render_to_string('infrastructure/emails/verify_email.html', {
        'user': user,
        'verification_link': verification_link,
    })
    
    email = EmailMessage(
        subject=subject,
        body=html_message,
        from_email=DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.content_subtype = 'html'
    email.send()

def _generate_username():
    adjectives = [
        "Swift", "Fierce", "Cunning", "Mighty", "Silent", "Shadow", "Vibrant", "Ancient",
        "Rapid", "Brave", "Loyal", "Bold", "Clever", "Stormy", "Golden", "Venomous",
        "Tireless", "Hardy", "Relentless", "Savage", "Stealthy", "Colossal", "Titanic", "Elder",
        "Diligent", "Industrious", "Fearless", "Formidable", "Dreaded", "Resilient", "Resourceful", 
        "Ruthless", "Shrewd", "Tenacious", "Vigilant", "Dominant", "Unyielding", "Wily", "Ferocious",
        "Daring", "Giant", "Mighty", "Swift-footed", "Ironclad", "Unstoppable", "Nimble", "Persevering",
        "Wise", "Cunning", "Sharp-eyed", "Watchful", "Dauntless", "Noble", "Enduring", "Merciless",
        "Survivor", "Indomitable", "Strategic", "Farsighted", "Adaptive", "Hardened", "Feral", "Majestic",
        "Regal", "Conquering", "Savvy", "Tactical", "Mastermind", "Invincible", "Ingenious", "Resolute",
        "Fermenting", "Seething", "Dominant", "Vortex", "Infernal", "Apex", "Monarch", "Omniscient",
        "Boundless", "Ethereal", "Arcane", "Mystic", "Esoteric", "Phantom", "Eclipsing", "Stalwart",
        "Imperial", "Eldritch", "Everlasting", "Epochal", "Unrelenting", "Glorious", "Pioneer", "Visionary",
        "Voidborn", "Cryptic", "Unfathomable", "Inexorable", "Provident", "Daemonic", "Labyrinthine"
    ]
    nouns = [
        "Ant", "Colony", "Nest", "Swarm", "Queen", "Worker", "Forager", "Soldier",
        "Egg", "Larva", "Pupa", "Tunnel", "Chamber", "Hatchling", "Harvester", "Digger",
        "Scout", "Breeder", "Reaper", "Defender", "Invader", "Warrior", "Goliath", "Overmind",
        "Hive", "Guardian", "Sentinel", "Commander", "Empress", "King", "Princess", "Baron",
        "Overlord", "Horde", "Striker", "Protector", "Survivor", "Builder", "Tunneler", "Pioneer",
        "Forager", "Throne", "Realm", "Emissary", "Strategist", "Warlord", "Monarch", "Ascendant",
        "Mutant", "Broodmother", "Alpha", "Hivemind", "Dominator", "Conqueror", "Tyrant", "Architect",
        "Seer", "Alchemist", "Elder", "Phantom", "Specter", "Shadow", "Titan", "Juggernaut",
        "Pestilence", "Scourge", "Warden", "Keeper", "Harbinger", "Sentient", "Oracle", "Champion",
        "Tactician", "Genius", "Hierarch", "Ruler", "Pioneer", "Sovereign", "Mindweaver", "Nightmare",
        "Exalted", "Primarch", "Bloodline", "Paragon", "Mystic", "Shaman", "Chronicler", "Nomad",
        "Observer", "Executioner", "Exarch", "Prophet", "Prodigy", "Tyrant", "Tactician", "General",
        "Colonizer", "Navigator", "Wayfinder", "Explorer", "Incubator", "Propagator", "Lifebringer", "Evolver"
    ]

    i = 0
    while True:
        adjective = random.choice(adjectives)
        noun = random.choice(nouns)
        number = random.randint(1000, 99999)

        username = f"{adjective}{noun}{number}"

        i += 1
        if i > 100:
            username = str(uuid.uuid4())
        
        if i > 200:
            raise Exception('cant generate more names')

        if not User.objects.filter(username=username).exists():
            return username

