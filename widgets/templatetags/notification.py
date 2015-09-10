from restful.shortcuts import errors, last_input

from django import template
from signali_notification.forms import get_anon_subscriber_form

register = template.Library()


@register.inclusion_tag('_subscribeform.html')
def subscribeform(request, contactpoint, form=None):
    prefix = 'subscriber'
    if form is None:
        form = get_anon_subscriber_form(contactpoint, data=last_input(request), prefix=prefix)
    return {
        "prefix": prefix,
        "form": form,
        "errors": errors(request).get(prefix+"form", None),
        "contactpoint": contactpoint,
        "request": request
    }

