from infrastructure.services.engine.usernames_repository_interface import iUsernamesRepository
from infrastructure.models import User
from typing import Dict
from asgiref.sync import sync_to_async

class UsernamesRepository(iUsernamesRepository):

    async def get_usernames(self) -> Dict[int, str]:
        return await self._get_usernames_sync()
    
    @sync_to_async
    def _get_usernames_sync(self):
        return list(User.objects.values('id', 'username'))