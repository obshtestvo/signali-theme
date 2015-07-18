require('./comment.scss')

module.exports = function (componentService) {
    componentService.register('comment', {
        template: require('./comment.html'),
        include: {
            circle: require('./circle.svg'),
            reply: require('./reply.svg')
        },
        created: function () {
            $(".reply-icon").appendTo($(".answer"));
        }
    })
}