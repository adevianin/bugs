from collections import namedtuple
from typing import List

class Size(namedtuple('Size', ['width', 'height'])):

    @classmethod
    def from_json(cls, size_json: List[int]):
        return Size(size_json[0], size_json[1])