from infrastructure.models import User
from typing import Dict

class UsernamesRepository():

    async def get_usernames(self) -> Dict[int, str]:
        queryset = User.objects.all().values('id', 'username')
        usernames = [row async for row in queryset]
        return usernames
    