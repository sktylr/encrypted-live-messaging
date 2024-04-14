import logging

from api import settings


class DebugLoggingMiddleware:
    def __init__(self, get_response):
        self._get_response = get_response

    def __call__(self, request):
        if not settings.DEBUG_LOGGING:
            return self._get_response(request)
        logging.info(f"Incoming request {request.method} {request.path} with body {request.body[:255]}")
        response = self._get_response(request)
        logging.info(f"Response for request {request.path}: {response.content[:255]}")
        return response
