from enum import StrEnum
import random

class DominationCodes(StrEnum):
    A = 'A'
    B = 'B'
    C = 'C'
    D = 'D'
    E = 'E'
    S = 'S' # for test purposes only

    @classmethod
    def check_domination(cls, first_code: 'DominationCodes', second_code: 'DominationCodes') -> int:
        if first_code == second_code:
            return 0
        
        domination_rules = {
            DominationCodes.S: [DominationCodes.A, DominationCodes.B, DominationCodes.C, DominationCodes.D, DominationCodes.E], 
            DominationCodes.A: [DominationCodes.B, DominationCodes.C, DominationCodes.D, DominationCodes.E],
            DominationCodes.B: [DominationCodes.C, DominationCodes.D, DominationCodes.E],
            DominationCodes.C: [DominationCodes.D, DominationCodes.E],
            DominationCodes.D: [DominationCodes.E],
            DominationCodes.E: []
        }
        
        if second_code in domination_rules[first_code]:
            return 1
        
        if first_code in domination_rules[second_code]:
            return -1
        
        return 0
    
    @classmethod
    def random(cls) -> 'DominationCodes':
        return random.choice([DominationCodes.A, DominationCodes.B, DominationCodes.C, DominationCodes.D, DominationCodes.E])