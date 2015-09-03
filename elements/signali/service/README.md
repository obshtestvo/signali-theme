Elements using animateContentSwitch find their animation container
by querying for `[animation-container]`.

This should actually be wrapped in animateContentSwitch itself (DRY) so that it's not required
for other elements to do it by themselves.