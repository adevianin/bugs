from enum import StrEnum

class MarkerTypes(StrEnum):
    POINTER = 'pointer'
    CROSS = 'cross'
    EAT = 'eat'
    PILLAGE = 'pillage'
    LOAD = 'load'
    UNLOAD = 'unload'