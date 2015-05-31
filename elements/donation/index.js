require('./donation.scss')

module.exports = function (componentService) {
    componentService.register('donation', {
        template: require('./donation.html')
    })
}