import json

from core.world.world_data_repository_interface import iWorldDataRepository

class WorldDataRepository(iWorldDataRepository):
    def __init__(self, filepath):
        self.filepath = filepath

    def get(self):
        f = open(self.filepath, "r")
        data = f.read()
        f.close()
        
        return json.loads(data)

    def push(data):
        pass
    

