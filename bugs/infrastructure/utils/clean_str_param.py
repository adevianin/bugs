from infrastructure.settings import MAX_STRING_PARAM_LENGTH

def clean_str_param(string: str = ''):
    return string[:MAX_STRING_PARAM_LENGTH]