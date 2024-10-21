from core.world.settings import NEW_EGG_FOOD_COST, STEPS_IN_YEAR

class ConstantsClientSerializer():

    def serialize_constants(self):
        return {
            'NEW_EGG_FOOD_COST': NEW_EGG_FOOD_COST,
            'STEPS_IN_YEAR': STEPS_IN_YEAR
        }