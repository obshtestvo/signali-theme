function ComponentService(angularApp) {
    this.app = angularApp;
    this.registered = [];
    this.app.directive('webComponentTemplate', function () {
        return {
            restrict: 'A',
            link: function (scope, $template) {
                var domContent = []
                var $content = scope.content
                $template = $($template[0]);
                angular.forEach($content, function (el) {
                    domContent.push(el)
                });
                $content = $(domContent);
                $template.find('content[select]').each(function () {
                    var $placeholder = $(this);
                    var filter = $placeholder.attr('select')
                    $placeholder.after($content.filter(filter))
                    $placeholder.remove();
                    $content = $content.not(filter)
                })
                $template.find('content').each(function () {
                    var $placeholder = $(this);
                    $placeholder.after($content)
                    $placeholder.remove();
                })
                delete scope.content;
            }
        }
    });
}
ComponentService.prototype.register = function (name, options) {
    if (this.has('name')) throw Error("Component with the same name already exists");
    options = this._transformOptionsForAngular(options)
    var directive = angular.extend({}, ComponentService.componentDefaults, options)
    this.registered.push(name);
    this.app.directive(name, function () {
        return directive;
    });
}
ComponentService.prototype.has = function (name) {
    return this.registered.indexOf('name') > -1;
}
ComponentService.prototype._transformOptionsForAngular = function (o) {
    var keySwaps = {
        "publish": "scope",
        "template": "templateUrl",
        "created": "link",
    }
    for (var key in keySwaps) {
        var angularKey = keySwaps[key]
        if (o.hasOwnProperty(key)) {
            o[angularKey] = o[key];
            delete o[key];
        }
    }
    if (o.hasOwnProperty('attached') && !o.hasOwnProperty('link')) {
        var callback = o.attached;
        o.link = function (scope, $el, attrs, ctrls, transclude) {
            $el.ready(function () {
                callback(scope, $el, attrs, ctrls, transclude);
            })
        }
        delete o['attached'];
    }
    return o;
}
ComponentService.componentDefaults = {
    priority: 2,
    transclude: true,
    replace: true,
    controller: function ($scope, $element, $attrs, $transclude) {
        if ($transclude) {
            $transclude(function (content) {
                $scope.content = content;
                //console.log(content)
            })
        }
    },
}

module.exports = ComponentService;