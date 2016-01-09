
# Default theme for [Signali](https://github.com/obshtestvo/signali)
Templates (*html and other formats*), styling, scripts.

## Setup
### OS

Requires:
 - `sass` (which requires `ruby`); **versions tested**: sass 3.4.9 and 3.4.13, ruby 2.15 and 2.2
 - `nodejs` (with `npm`); **versions tested**: 0.12

### Project
After OS requirements are satisfied just run:

```sh
npm install 
bower install # needed for 2 dependencies that are not available on npm
```
to install the dependencies.

## Quick start

Open `research` directory in terminal and run `webpack --watch`. Windows-based developers can use `compile.bat` to ease the process.

## Deployment notes:

Compile with:
```
(export PRODUCTION=1 && webpack)
```

And transfer the `build` directory to deployment server.

## Architecture decisions
The frontend ecosystem right now is diverse. There are things 
like [angularjs](https://github.com/angular/angular.js),
[facebook react](https://github.com/facebook/react),
[web components](http://www.w3.org/TR/components-intro/) and other frameworks/emerging standards.
Each have their advantages and each have their drawbacks.

### Shortcomings
The theme was developed during a time of boom for various frontend technologies/methodologies.
It's a transitional project between good old server-rendered html and the fully js powered
custom-element UI that needs to be pre-rendered on the serverside via nodejs for SEO reasons.

Even at the moment of writing this there isn't a well-integrated method that supports wide range of
server-technologies to do prerendering.

### Conventions

 - **Backend-agnostic**: assets' management should be independent from any chosen backend framework or language
 - **Web components**: they are coming, so their concept should be followed as closely as possible.
   The previous was true at the beginning of this project but since then, web component development slowed down.
   Also many issues had come up. It's now better to use React.
 - **Modularity**: always think modular, extract all files related to a single element as web-component (styling, scripts, template, images... everything)
 - **Readability & perceived performance over code optimisation**: always write readable code, performance can be achieved through
  best practices and creating a user feeling of a responsive system
 - **Compression**:
   - All assets must be compressed (including images) to achieve minimum transfer size
   - Embed small images as base64
   - All assets *[of common file types]* must be combined into 1 file
   - The asset combination mechanism should allow splitting into chunks, so that the initial load is not too big
   - Source maps should work in the compiled versions but should be removable for production
 - A **universal import/require** mechanism should be used. It should be capable of importing different type of files:
 javascript, css, images, fonts, html templates, sass, etc.
 - **The template language** used in web components must be easy to change
 - **Icons** should be svg-based. 
 - **Javascripts**:
   - Should be in a isolated scope
   - Should explicitly state requirements in code (*not comments or meta-lanaguages*)



### Specificity
The conventions are implemented through:

 - [webpack](http://webpack.github.io/docs/) for everything besides web components
 - custom elements via [`skatejs`](http://skatejs.github.io/) and shadowdom-like templating via a project-specific script

#### Webpack
This projects uses [webpack](http://webpack.github.io/docs/). 
It handles everything from the conventions except webcomponent-like behavior.

You can read [webpack's documentation](http://webpack.github.io/docs/) for more details. 
Basically it does everything from compiling `.scss -> .css` to combining, minifying and splitting chunks
for any kind of files; It's capable of [compressing js, css, svg; transpiling DSLs and dialects,
compiling template engines; compiling gettext files into json and many many others](http://webpack.github.io/docs/list-of-loaders.html)

#### Web components emulation
***EDIT***: Using skate revealed many drawbacks that are not clearly stated by its documentation.
Currently it's better to do a React-based app.

The project doesn't use the [webcomponents polyfill](https://github.com/webcomponents/webcomponentsjs) 
because it too cutting-edge and easily causes problems even in modern browsers.

Instead, the project makes use of [`skatejs`](http://skatejs.github.io/) to emulate web components. 

The key aspects of web components that are replicated:
 - html tags with custom names that use their own template
 - allow executing javascript after the element is rendered
 - allow passing data to custom web component through attributes
 - allow distributing the elements nested in the custom element to different
 locations in its template using the `<content select='...'></content>` tag
 - **no shadowdom**
 
The emulation is happening by [signali/pseudo-webcomponent](elements/signali/pseudo-webcomponent/index.js).
This is basically a factory-pattern script that can register custom elements as classes:

*in main script file*:
```js
import ComponentService from 'service/pseudo-webcomponent.skate';
componentService = new ComponentService();
import customElement from 'custom';
componentService.register(customElement);
```

*in element's file*
```js
import template from './custom.html';

export default class {
    static displayName = 'custom';
    static template = template;
    static created(element) {
        // javascript to run after the element is initialised
    }
}
```

[Mustache.js](https://github.com/janl/mustache.js/) is used as template language in `custom.html`.

If the element appeared in the html like so:

```
<custom>
    <h1>Headline</h1>
    <p>...content...</p>
    Left over text
</custom>
```

and had a template like this:
```
<section class="heading-wrapper">
    <content select="h1"></content>
</section>
<section class="content-wrapper">
    <content select="p"></content>
</section>
```

will produce final html:
```
<custom>
    <section class="heading-wrapper">
        <h1>Headline</h1>
    </section>
    <section class="content-wrapper">
        <p>...content...</p>
    </section>
</custom>
```

The remaining unmatched content (`"Left over text"`) will be stored in `detachedContent` property of `<custom>`.
If the template included an all-matching `<content></content>` the same would have been inserted there.