import request from 'ajax/request'
import $ from 'jquery';

export default class {
    static displayName = 'stat-visit';
    static type = 'attribute';
    static properties = {
        statUser: {
            attribute: true
        }
    };
    static created (el) {
        var $el = $(el);

        $el.on('click.stat-visit', function() {
            request.json({
                url: el.getAttribute('stat-visit'),
                method: 'post'
            });
            $el.off('.stat-visit');
        })
    }
}