require('./headline.scss')

module.exports = function (componentService) {
    componentService.register('headline', {
        template: require('./headline.html'),
        prototype: {
            setTitle: function (title) {
                this.querySelector('[title]').innerHTML = title;
            },
            setSubtitle: function (html) {
                var subtitle = this.querySelector('p');
                if (!subtitle) {
                    subtitle = document.createElement('p');
                    this.appendChild(subtitle);
                }
                subtitle.innerHTML = html
            }
        }
    })
}