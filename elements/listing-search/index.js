require('./listing-search.scss')

module.exports = function (componentService) {
    componentService.register('listing-search', {
        template: require('./listing-search.html')
    })
}