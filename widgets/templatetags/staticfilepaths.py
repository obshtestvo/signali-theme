import os

from django.template import Library
from django.conf import settings
from django.contrib.staticfiles import finders

from signali.template_base import getter_tag_factory

register = Library()


def get_static_full_filepath(partial_path):
    if settings.DEBUG:
        return finders.find(partial_path)
    return os.path.join(settings.STATIC_ROOT, partial_path)



"""
Retrieves the filesystem path to a static file
{% static_filepath 'path' %} -> outputs
{% static_filepath 'path' as static_file_filepath %} -> sets variable
"""
register.tag('static_filepath', getter_tag_factory(get_static_full_filepath))
