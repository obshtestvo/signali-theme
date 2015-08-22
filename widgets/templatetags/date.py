from django import template
from django.utils import formats, timezone
from django.utils.dateformat import format, time_format

from django.utils.translation import ugettext_lazy as _

register = template.Library()


def humandate(date):
    formatting = 'j N'
    if timezone.now().year != date.year:
        formatting += ' Y'
    try:
        return formats.date_format(date, formatting)
    except AttributeError:
        try:
            return format(date, formatting)
        except AttributeError:
            return ''

register.filter(humandate, expects_localtime=True, is_safe=False)

def humantime(time):
    formatting = 'H:i'
    try:
        formatted = formats.time_format(time, formatting)
    except AttributeError:
        try:
            formatted = time_format(time, formatting)
        except AttributeError:
            formatted = ''
    return _("{date} at {time}").format(date=humandate(time), time=formatted)

register.filter(humantime, expects_localtime=True, is_safe=False)