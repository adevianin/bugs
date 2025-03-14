from django.http.request import HttpRequest

def build_base_url(request: HttpRequest):
    return request.build_absolute_uri('/')[:-1]