from django import template

register = template.Library()

@register.inclusion_tag('location/_featured_areas.html')
def featured_areas(field, selected=[]):
    areas = field.queryset.filter(is_featured=True)
    if selected:
        areas = areas | selected
    else:
        selected = []
    return {
        "areas": areas,
        "selected_areas": selected,
    }