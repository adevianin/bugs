import logging
from django.http import HttpResponse, JsonResponse
from core.world.exceptions import GameError, StateConflictError, EntityNotFoundError
from infrastructure.exceptions import DailyEmailLimitExceededException
from infrastructure.utils.log_request_exception import log_request_exception
from bugs.settings import DEBUG

class HttpRequestErrorsHandlerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception: Exception):
        log_request_exception(request, exception)

        if DEBUG:
            raise exception

        if isinstance(exception, GameError):
            match exception:
                case StateConflictError():
                    return JsonResponse(exception.to_dict(), status=409)
                case _:
                    return HttpResponse('Something went wrong', status=400)
                
        if isinstance(exception, DailyEmailLimitExceededException):
            return HttpResponse(status=429)

        return HttpResponse('Something went wrong', status=500)