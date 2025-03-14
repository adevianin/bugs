from infrastructure.models import User
import random
import uuid

def generate_username():
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
