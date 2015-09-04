from django import template

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
