from abc import ABC
from typing import Dict

class iUsernamesRepository(ABC):

    async def get_usernames(self) -> Dict[int, str]:
        pass
