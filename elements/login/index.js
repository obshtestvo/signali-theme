require('./login.scss');

module.exports = function (componentService) {
    componentService.register('login', {
        type: 'attribute',
        created: function () {
            var el = this;
            $(el).find('footer a').click(function(e) {
                e.preventDefault();
                el.close();
            })
        }
    });
};