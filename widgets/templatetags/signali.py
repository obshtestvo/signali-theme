from django import template

from signali.models import Partner

register = template.Library()

@register.inclusion_tag('_featured_partners.html')
def featured_partners():
    return {
        "partners": Partner.objects.featured(),
    }
