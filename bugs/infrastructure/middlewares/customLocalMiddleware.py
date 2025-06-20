from django.utils import translation

class CustomLocaleMiddleware():

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        accept_language = request.META.get('HTTP_ACCEPT_LANGUAGE', '')
        first_lang = accept_language.split(',')[0].lower().strip()

        if 'uk' in first_lang or 'ru' in first_lang:
            selected_lang = 'uk'
        else:
            selected_lang = 'en'

        translation.activate(selected_lang)
        request.LANGUAGE_CODE = selected_lang

        response = self.get_response(request)
        return response
    