from restful.shortcuts import errors, last_input

from django import template
from django.db.models import Prefetch

from contact.apps import setting
from signali_contact.models import Organisation, ContactPoint
from signali_taxonomy.models import Category
from signali_location.models import Area
from contact_feedback.forms import get_feedbackfrom
from contact.forms import get_contactpoint_from
from signali_contact.forms import UserCriteriaForm

register = template.Library()

@register.inclusion_tag('contact/_stats.html')
def contactpoint_stats():
    return {
        "organisations_count": Organisation.objects.all().count(),
        "areas_count": Area.objects.non_address().exclude(contact_points=None).count(),
    }


@register.inclusion_tag('contact/list/_overview.html')
def overview(request):
    return {
        "visitedlast_points": ContactPoint.objects.parents().visited_last()[0:4],
        "effective_points": ContactPoint.objects.parents().most_effective()[0:4],
        "accessible_points": ContactPoint.objects.parents().most_accessible()[0:4],
        "addedlast_points": ContactPoint.objects.parents().added_last()[0:4],
        "request": request
    }


@register.inclusion_tag('contact/single/_feature.html')
def feature_item(request, point, name, compare_to, is_negative, display_type, display_size, positive_text, negative_text):
    return {
        "request": request,
        "point": point,
        "value": getattr(point, name),
        "compare_to": compare_to,
        "feature_params": {name: "yes"},
        "text": negative_text if is_negative else positive_text,
        "type": display_type,
        "size": display_size,
    }



@register.inclusion_tag('contact/list/_featured_overview.html')
def featured_overview(request):
    return {
        "contact_points": ContactPoint.objects.parents().featured()[0:4],
        "request": request
    }



@register.inclusion_tag('contact_feedback/list/_feedback_list.html')
def feedback_list(request, contactpoint):
    return {
        "feedback_entries": contactpoint.feedback.published(request.user),
        "request": request
    }


@register.inclusion_tag('contact/_addnew_form.html')
def addnew_form(request, form=None):
    prefix = 'proposal'
    if form is None:
        form = get_contactpoint_from(initial={"proposed_by": request.user}, data=last_input(request), prefix=prefix)
    return {
        "prefix": prefix,
        "form": form,
        "checkbox_value": ContactPoint.YES,
        "errors": errors(request).get(prefix+"form", None),
        "request": request
    }


@register.inclusion_tag('contact_feedback/_survey.html')
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



@register.inclusion_tag('contact/list/_searchbar.html')
def searchbar(request, form=None):
    if form is None:
        form = UserCriteriaForm(data=request.params)
    return {
        "form": form,
        "errors": errors(request).get("form", None),
        "request": request
    }


@register.inclusion_tag('contact/list/_advanced_searchbar.html')
def advanced_searchbar(request, form=None):
    if form is None:
        form = UserCriteriaForm(data=request.params)
    return {
        "form": form,
        "errors": errors(request).get("form", None),
        "request": request
    }


@register.inclusion_tag('contact/list/_entry.html')
def contactpoint_listing_entry(request, contactpoint_list, contactpoint, index, form, is_loose_search):
    is_first = index == 1
    score = None
    try:
        score = contactpoint.score
    except AttributeError:
        pass
    try:
        score += contactpoint.taxonomy_score
    except:
        pass

    try:
        separate = is_first or contactpoint_list.current_score != score
        contactpoint_list.current_score = score
    except AttributeError:
        separate = False
    try:
        area = form.cleaned_data["areas"][0]
        if not area.is_root_node() and score is not None:
            score += 1
    except:
        area = None
    return {
        "is_loose_search": is_loose_search,
        "score": score,
        "separate": separate,
        "is_first": is_first,
        "area": area,
        "point": contactpoint,
        "request": request
    }

