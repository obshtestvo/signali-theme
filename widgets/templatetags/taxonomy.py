from itertools import chain
from operator import attrgetter

from django import template

from signali_taxonomy.models import Category, Keyword

register = template.Library()

@register.inclusion_tag('_categories_menu.html', takes_context=True)
def categories_menu(context):
    return {
        "categories": Category.objects.root_categories_plus_children(),
        "request": context.get('request')
    }

@register.inclusion_tag('taxonomy/_mixed_picker_options.html')
def taxonomy_mixed_options(request, form):
    return {
        "categories": Category.objects.children().select_related('parent'),
        "keywords": Keyword.objects.all(),
        "request": request,
        "form": form
    }

@register.inclusion_tag('_popular_categories.html')
def popular_categories(request):
    return {
        "categories": Category.objects.popular()[:13],
        "request": request
    }


