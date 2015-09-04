from restful.signals import pre_success_rendering
from restful.signals import pre_error_rendering
from contact_feedback.views import ListView
from django.dispatch import receiver

@receiver(pre_success_rendering, sender=ListView)
def new_feedback_success_with_registration(request, url_name, **kwargs):
    matches_uri = url_name == 'contact-point-feedback-list'
    inactive_user = request.user.is_valid
    triggered_registration = request.params.get('ui_include_auth') == 'registration'
    if request.is_pjax() and matches_uri and (triggered_registration or inactive_user):
        return 'contact_feedback/new_feedback_with_registration'


@receiver(pre_error_rendering)
def new_contactpoint_error(request, url_name, **kwargs):
    matches_uri = url_name == 'contact-point-list'
    if request.is_pjax() and matches_uri:
        return 'error/new_contactpoint'


@receiver(pre_error_rendering)
def new_feedback_error(request, url_name, **kwargs):
    matches_uri = url_name == 'contact-point-feedback-list'
    if request.is_pjax() and matches_uri:
        return 'error/new_feedback'
