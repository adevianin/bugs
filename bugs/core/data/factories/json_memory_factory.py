from core.world.entities.base.live_entity.memory import Memory
from core.world.utils.point import Point

class JsonMemoryFactory():

    def build_memory_from_json(self, memory_json):
        datas = []
        for memory_record in memory_json:
            datas.append({
                'id': memory_record['id'],
                'position': Point(memory_record['position'][0], memory_record['position'][1]),
                'type': memory_record['type']
            })
        return Memory(datas)