class OwnershipConfig:

    @staticmethod
    def build_empty():
        return OwnershipConfig(None, None)
    
    def __init__(self, owner_colony_id: int, owner_user_id: int):
        self.owner_colony_id = owner_colony_id
        self.owner_user_id = owner_user_id