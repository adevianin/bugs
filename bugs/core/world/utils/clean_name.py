from .clean_string import clean_string
from core.world.settings import MAX_NAME_LENGTH

def clean_name(name: str = ''):
    cleaned = clean_string(name)
    return cleaned[:MAX_NAME_LENGTH]