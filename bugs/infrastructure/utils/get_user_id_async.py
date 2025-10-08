from asgiref.sync import sync_to_async

def _get_user_id(user):
    return user.id

get_user_id_async = sync_to_async(_get_user_id)