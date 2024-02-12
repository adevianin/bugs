from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment

class JsonNuptialEnvironmentFactory():

    def build_nuptial_environment_from_json(self, json: dict):
        owner_id = json['owner_id']
        base_genes = {}
        return NuptialEnvironment.build(owner_id, base_genes)