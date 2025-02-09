import logging
from django.http import HttpResponse
from core.world.exceptions import GameError
from core.world.messages import Messages

class LogHttpRequestErrorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self._logger = logging.getLogger('request_logger')

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        msg = f"Exception [{type(exception).__name__}]: {exception}, Request: {request}"
        self._logger.error(msg)

        if isinstance(exception, GameError):
            return HttpResponse(Messages.SOMETHING_WENT_WRONG, status=400)

        return HttpResponse(Messages.SOMETHING_WENT_WRONG, status=500)