from taxonomy.models import Category, Keyword
from contact.forms import UserCriteria
from django import template
from itertools import chain
from operator import attrgetter

register = template.Library()

@register.inclusion_tag('_categories_menu.html', takes_context=True)
def categories_menu(context):
    return {
        "categories": Category.objects.root_categories_plus_children(),
        "request": context.get('request')
    }

@register.inclusion_tag('taxonomy/_mixed_picker_options.html')
def taxonomy_mixed_options(request, form=None):
    if form is None:
        form = UserCriteria(data=request.params.copy())

    choices = sorted(
        chain(Category.objects.children(), Keyword.objects.all()),
        key=attrgetter('title'))
    return {
        "choices": choices,
        "request": request,
        "form": form
    }

