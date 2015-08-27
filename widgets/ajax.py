from restful.signals import pre_success_rendering
from contact_feedback.views import ListView
from django.dispatch import receiver

@receiver(pre_success_rendering, sender=ListView)
def new_feedback_success(request, **kwargs):
    if request.is_pjax() and request.params.get('submission') == 'new_feedback':
        return 'notification/new_feedback'
