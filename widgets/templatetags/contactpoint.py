from django import template
from contact.models import Organisation
from location.models import Area
from contact.apps import setting

register = template.Library()

@register.inclusion_tag('_stats.html')
def contactpoint_stats():
    return {
        "organisations_count": Organisation.objects.all().count(),
        "areas_count": Area.objects.count_size(exclude=setting('contact_address_areasize')),
    }