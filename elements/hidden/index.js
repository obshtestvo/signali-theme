export default class {
    static displayName = 'hidden';
    static type = 'attribute';

    static created (el) {
        var $el = $(el);
        $el.prop('hidden', false);
        $el.removeAttr('hidden');
        $el.hide();
    }
}