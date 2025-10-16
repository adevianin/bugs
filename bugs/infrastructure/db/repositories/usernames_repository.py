from infrastructure.services.engine.usernames_repository_interface import iUsernamesRepository
from infrastructure.models import User
from typing import Dict

class UsernamesRepository(iUsernamesRepository):

    async def get_usernames(self) -> Dict[int, str]:
        queryset = User.objects.all().values('id', 'username')
        usernames = [row async for row in queryset]
        return usernames
    