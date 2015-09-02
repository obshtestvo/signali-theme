from restful.signals import pre_success_rendering
from restful.signals import pre_error_rendering
from contact_feedback.views import ListView
from django.dispatch import receiver

@receiver(pre_success_rendering, sender=ListView)
def new_feedback_success(request, **kwargs):
    if request.is_pjax() and request.params.get('submission') == 'new_feedback':
        return 'notification/new_feedback'


@receiver(pre_error_rendering)
def new_feedback_error(request, **kwargs):
    if request.is_pjax() and request.params.get('submission') == 'new_feedback':
        return 'error/new_feedback'
