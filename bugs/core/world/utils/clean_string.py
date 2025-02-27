import re

def clean_string(text):
    return re.sub(r'[^a-zA-Zа-яА-ЯґҐєЄіІїЇ0-9 ]', '', text)