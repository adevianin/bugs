import json
import os
from django import template
from bugs.settings import STATIC_ROOT, STATIC_URL

register = template.Library()

_manifest_cache = None

@register.simple_tag
def hashed_static(path):
    global _manifest_cache
    if _manifest_cache is None:
        manifest_path = os.path.join(STATIC_ROOT, 'manifest.json')
        with open(manifest_path, 'r') as f:
            _manifest_cache = json.load(f)

    return STATIC_URL + _manifest_cache.get(path, path)
