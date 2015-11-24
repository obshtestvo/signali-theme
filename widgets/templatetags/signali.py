from django import template
from django.conf import settings

from signali.models import Partner

register = template.Library()


@register.inclusion_tag('_featured_partners.html')
def featured_partners():
    return {
        "partners": Partner.objects.featured(),
    }


@register.simple_tag
def make_absolute(url):
    http_schema = 'https' if settings.ALWAYS_USE_HTTPS else 'http'
    return http_schema + '://' + settings.MAIN_HOST + url
