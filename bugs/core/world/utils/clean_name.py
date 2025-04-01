from .clean_string import clean_string
from core.world.settings import MAX_NAME_LENGTH, MIN_NAME_LENGTH

def clean_name(name: str = ''):
    cleaned = clean_string(name).strip()
    cleaned = cleaned[:MAX_NAME_LENGTH]
    if len(cleaned) < MIN_NAME_LENGTH:
        cleaned += 'x' * (MIN_NAME_LENGTH - len(cleaned))

    return cleaned