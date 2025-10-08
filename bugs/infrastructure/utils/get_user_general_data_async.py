from asgiref.sync import sync_to_async

def _get_general_data(user):
    return user.get_general_data()

get_general_data_async = sync_to_async(_get_general_data)