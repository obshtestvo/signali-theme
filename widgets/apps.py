from django.apps import AppConfig

class ThemeConfig(AppConfig):
    name = "themes.default.widgets"
    verbose_name = "Default theme"

    def ready(self):
        from . import ajax
