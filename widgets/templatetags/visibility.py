from django import template
from signali.models import Visibility, CategoryProxy

register = template.Library()

@register.inclusion_tag('_popular_categories.html')
def popular_categories(request):
    return {
        "categories": CategoryProxy.objects.popular()[:13],
        "request": request
    }
