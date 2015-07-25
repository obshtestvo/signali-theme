from django import template
from django.db.models import Prefetch

from contact.apps import setting
from contact.models import Organisation
from signali.models import ContactPointProxy, CategoryProxy
from location.models import Area

register = template.Library()

@register.inclusion_tag('_stats.html')
def contactpoint_stats():
    return {
        "organisations_count": Organisation.objects.all().count(),
        "areas_count": Area.objects.count_size(exclude=setting('contact_address_areasize')),
    }


@register.inclusion_tag('_featured_areas.html')
def featured_areas(request):
    return {
        "locations": Area.objects.prefetch_related(
            Prefetch('contact_points',
                     queryset=ContactPointProxy.objects.featured()[:5])
        ),
        "request": request
    }


@register.inclusion_tag('_featured_category.html')
def featured_category(request):
    return {
        "category": CategoryProxy.objects.featured()[0],
        "request": request
    }

