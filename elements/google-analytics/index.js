module.exports = function (componentService) {
    var name = 'googleAnalytics';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: '',
        publish: {
            'account':'@'
        },
        attached: function (scope, $el, attrs, ctrls, transclude) {
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='https://www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-'+attrs.account+'-X','auto');ga('send','pageview');
        }
    })
}