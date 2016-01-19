from django import template
from django.core import urlresolvers
from django.contrib.contenttypes.models import ContentType

register = template.Library()

known_email_providers = {
    "gmail.com": "GMail",
    "googlemail.com": "GMail",
    "abv.bg": "АБВ",
    "yahoo.com": "Yahoo!",
    "yahoo.co.uk": "Yahoo!",
    "hotmail.com": "Outlook",
}

known_email_providers_urls = {
    "yahoo.com": "login.yahoo.com",
    "yahoo.co.uk": "uk.mail.yahoo.com",
}

@register.filter
def email_provider(email):
    provider = email.rsplit('@', 1)[1]
    try:
        provider = known_email_providers[provider]
    except:
        provider = provider

    return provider

@register.filter
def email_provider_url(email):
    provider = email.rsplit('@', 1)[1]
    try:
        provider = known_email_providers_urls[provider]
    except:
        pass

    return "http://"+provider

@register.filter
def admin_url(object):
    content_type = ContentType.objects.get_for_model(object.__class__)
    model = content_type.model if content_type.model != 'contactpoint' else 'contactpointgrouped'
    return urlresolvers.reverse("admin:%s_%s_change" % (content_type.app_label, model), args=(object.id,))
