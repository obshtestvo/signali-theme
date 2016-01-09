from django import template

from signali_taxonomy.models import Category, Keyword

register = template.Library()

@register.inclusion_tag('taxonomy/_categories_menu.html', takes_context=True)
def categories_menu(context):
    return {
        "categories": Category.objects.public().roots().prefetch_children(),
        "categories_count": Category.objects.public().children().non_empty().count(),
        "request": context.get('request')
    }

@register.inclusion_tag('taxonomy/_category_menu_column.html')
def category_menu_column(request, category):
    return {
        "category": category,
        "children": category.children.public().non_empty(),
        "request": request
    }

@register.inclusion_tag('taxonomy/_mixed_picker_options.html')
def taxonomy_mixed_options(request, form):
    return {
        "categories": form.fields["categories"].queryset,
        "keywords": form.fields["keywords"].queryset,
        "request": request,
        "form": form
    }

@register.inclusion_tag('taxonomy/_popular_categories.html')
def popular_categories(request):
    return {
        "categories": Category.objects.popular()[:13],
        "request": request
    }

@register.inclusion_tag('taxonomy/_featured_categories.html')
def featured_categories(request):
    return {
        # "categories": Category.objects.all()[:12],
        "categories": Category.objects.featured()[:12],
        "request": request
    }


