from django import template
from django.db.models import Model
from django.utils.encoding import force_text

register = template.Library()

@register.filter
def has_selected(field, value):
    if isinstance(value, Model):
        value = value.id
    return force_text(value) in field.value()
