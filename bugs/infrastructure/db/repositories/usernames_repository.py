from core.world.usernames_repository_interface import iUsernamesRepository
from infrastructure.models import User
from typing import Dict

class UsernamesRepository(iUsernamesRepository):

    def get_usernames(self) -> Dict[int, str]:
        usernames = User.objects.all().values('id', 'username')
        return list(usernames) 