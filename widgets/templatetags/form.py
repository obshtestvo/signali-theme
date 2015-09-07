from django import template
from django.db.models import Model
from django.utils.encoding import force_text

register = template.Library()

@register.filter
def has_selected(field, value):
    if isinstance(value, Model):
        value = value.id
    fieldvalue = field.value()
    return fieldvalue is not None and force_text(value) in field.value()

@register.filter
def has(form, field):
    return field.html_name in form.data
