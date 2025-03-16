from django.http.request import HttpRequest
import logging

def log_request_exception(request: HttpRequest, exception: Exception):
    logger = logging.getLogger('request_logger')
    logger.exception(request, exc_info=exception)
