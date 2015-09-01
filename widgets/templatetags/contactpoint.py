from restful.shortcuts import errors, last_input

from django import template
from django.db.models import Prefetch

from contact.apps import setting
from signali_contact.models import Organisation, ContactPoint
from signali_taxonomy.models import Category
from signali_location.models import Area
from contact_feedback.forms import get_feedbackfrom

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
        "locations": Area.objects.featured().prefetch_related(
            Prefetch('contact_points',
                     queryset=ContactPoint.objects.featured())
        ),
        "request": request
    }


@register.inclusion_tag('_featured_category.html')
def featured_category(request):
    return {
        "category": Category.objects.featured()[0],
        "request": request
    }


@register.inclusion_tag('_feedback_list.html')
def feedback_list(request, contactpoint):
    return {
        "feedback_entries": contactpoint.feedback.published(),
        "request": request
    }


@register.inclusion_tag('_addnew_form.html')
def addnew_form(request):
    return {
        "request": request
    }


@register.inclusion_tag('_survey.html')
def survey(request, contactpoint, form=None):
    prefix = 'survey'
    if form is None:
        form = get_feedbackfrom(contactpoint, initial={"user": request.user}, data=last_input(request), prefix=prefix)
    return {
        "prefix": prefix,
        "form": form,
        "errors": errors(request).get(prefix+"form", None),
        "contactpoint": contactpoint,
        "request": request
    }

