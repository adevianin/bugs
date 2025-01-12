import logging

class LogHttpRequestErrorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self._logger = logging.getLogger('request_logger')

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        msg = str(exception) + str(request)
        self._logger.error(msg)