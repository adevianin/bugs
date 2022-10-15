import json

class WorldDataRepository():
    def __init__(self, filepath):
        self.filepath = filepath

    def get(self):
        f = open(self.filepath, "r")
        data = f.read()
        f.close()
        
        return json.loads(data)

    def push(data):
        pass
    

