require('./card-item.scss')

module.exports = function (componentService) {
    componentService.register('card-item', {
        template: require('./card-item.html'),
        properties: {
            "tags": {
                get: function () {
                    return this.getAttribute('type')=='tags'
                }
            },
            "rating": {
                get: function () {
                    return this.getAttribute('type')=='rating'
                }
            }
        }
    })
}