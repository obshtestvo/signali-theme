from restful.signals import pre_success_rendering
from restful.signals import pre_error_rendering
from contact_feedback.views import ListView
from django.dispatch import receiver

@receiver(pre_success_rendering, sender=ListView)
def new_feedback_success_user_activation(request, url_name, data, **kwargs):
    matches_uri = url_name == 'contact-point-feedback-list'
    invalid_user = not request.user.is_valid
    is_first_feedback_for_contactpoint = data['feedback'].contactpoint.feedback.exclude(
        id=data['feedback'].id
    ).filter(user=request.user).count() == 0
    triggered_registration = request.params.get('ui_include_auth') == 'registration'
    if request.is_pjax() and matches_uri:
        if is_first_feedback_for_contactpoint and (triggered_registration or invalid_user):
            return 'contact_feedback/new_feedback_with_registration'
        if not is_first_feedback_for_contactpoint:
            return 'contact_feedback/new_feedback_after_first'


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
