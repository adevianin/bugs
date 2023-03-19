import json
from django.http import HttpResponseBadRequest
from json.decoder import JSONDecodeError

class ConvertJSONMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.content_type == 'application/json':
            try:
                request.json = json.loads(request.body)
            except JSONDecodeError:
                return HttpResponseBadRequest('Invalid JSON')
            
        response = self.get_response(request)

        return response
