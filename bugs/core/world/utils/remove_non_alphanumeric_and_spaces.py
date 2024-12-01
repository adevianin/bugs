import re

def remove_non_alphanumeric_and_spaces(text):
    return re.sub(r'[^A-Za-z0-9 ]', '', text)