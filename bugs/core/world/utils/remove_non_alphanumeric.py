import re

def remove_non_alphanumeric(text):
    return re.sub(r'[^A-Za-z0-9]', '', text)