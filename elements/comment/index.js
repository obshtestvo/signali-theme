require('./comment.scss');

module.exports = function (componentService) {
    componentService.register('comment', {
        template: require('./comment.html'),
        include: {
            "circle": require('./circle.svg')
        }
    });
};