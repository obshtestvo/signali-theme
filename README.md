
# Default theme for [Signali](https://github.com/obshtestvo/signali)
Templates (*html and other formats*), styling, scripts.

**IN ACTIVE DEVELOPMENT. DO NOT USE UNTIL STABLE**

## Setup
### OS

Requires:
 - `sass` (which requires `ruby`)
 - `nodejs` (with `npm`)

### Project
After OS requirements are satisfied just run:

```sh
npm install 
bower install
```
to install the dependencies.

## Architecture decisions
The frontend ecosystem right now is diverse. There are things 
like [angularjs](https://github.com/angular/angular.js),
[facebook react](https://github.com/facebook/react),
[web components](http://www.w3.org/TR/components-intro/) and other frameworks. Each have their advantages and
 each have their drawbacks.

### Conventions
 - Assets' management should be independent from any chosen backend framework or language
 - Web components are coming, so their concept should be followed as closely as possible
 - Always think modular, extract all files related to a single element as web-component (styling, scripts, template, images... everything)
 - Assets must be combined and minified to achieve minimum requests
 - Embed small images as base64
 - The asset combination mechanism should allow splitting into chunks, so that the initial load is not too big
 - All assets must be compressed (including images) to achieve minimum transfer size
 - Source maps should work in the compiled versions
 - A universal import/require mechanism should be used. It should be capable of importing different type of files:
 javascript, css, images, fonts, html templates, sass, etc.

### Specificity
The conventions are implemented through:
 
 - emulation of web components via angularjs directives
 - [webpack](http://webpack.github.io/docs/) for everything else

#### Webpack
This projects uses [webpack](http://webpack.github.io/docs/). 
It handles everything from the conventions except webcomponent-like behavior.

You can read [webpack's documentation](http://webpack.github.io/docs/) for more details. 
Basically it does everything from rendering `.scss` to `.css` to combining, minifying and splitting chunks
for any kind of files; It's capable of [compressing js, css, svg; rendering DSLs and dialects,
rendering template engines; rendering gettext files into json and many many others](http://webpack.github.io/docs/list-of-loaders.html) 

#### Web components emulation
The project doesn't use the [webcomponents polyfill](https://github.com/webcomponents/webcomponentsjs) 
because it too cutting-edge and easily causes problems even in modern browsers.

Instead, the project makes use of angular directives to emulate web components. 
The directives work well across browsers and angular has a 
large community if any problems occur.

The key aspects of web components that are replicated:
 - html tags with custom names that use their own template
 - allow executing javascript after the element is rendered
 - allow passing data to custom web component through attributes
 - allow distributing the elements nested in the custom element to different
 locations in its template using the `<content select='...'></content>` tag
 
The emulation is happening through a script called [pseudo-webcomponent.directive.js](elements/app/script/service/pseudo-webcomponent.directive.js).
This is basically a factory-pattern script that can register custom elements in a webcomponent-like manner:

*in main script file*:
```js
var ComponentService = require('service/pseudo-webcomponent.directive');
var customElement = require('custom');
customElement(componentService)
```

*in element's file*
```js
module.exports = function (componentService) {
    var name = 'custom';
    if (componentService.has(name)) return;

    componentService.register(name, {
        template: require('./custom.html'),
        attached: function (scope, $el, attrs, ctrls, transclude) {
            // javascript to run after the element is rendered in te dom
        }
    })
}
```
