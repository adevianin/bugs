class NuptialEnvironmentWeightsPack():

    def __init__(self, combat_damage_done_weight: int, combat_damage_received_weight: int, cold_damage_received_weight: int, building_weight: int):
        self.combat_damage_done_weight = combat_damage_done_weight
        self.combat_damage_received_weight = combat_damage_received_weight
        self.cold_damage_received_weight = cold_damage_received_weight
        self.building_weight = building_weight
