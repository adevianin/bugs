import random

def probability_check(chance: int) -> bool:
    return random.random() < (chance / 100)