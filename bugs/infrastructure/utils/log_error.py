import logging

def log_error(err_text: str):
    logger = logging.getLogger('request_logger')
    logger.error(err_text)
