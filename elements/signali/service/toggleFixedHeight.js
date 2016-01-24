export default function ($el, isFixed) {
    if (isFixed) {
        $el.height($el.height() + 'px');
        $el.css('overflow', 'hidden');
    } else {
        $el.css('height', '');
        $el.css('overflow', 'inherit');
    }
}
