
# Default theme for [Signali](https://github.com/obshtestvo/signali)
Templates (*html and other formats*), styling, scripts.

** IN ACTIVE DEVELOPMENT. DO NOT USE UNTIL STABLE **

## Related projects
Themes are not bundled. Main theme is located at: .....

Place the default or your theme in the `themes` directory and set its name as value for `THEME` setting. 

## Setup
### OS

Requires:
 - sass (which requires ruby)
 - nodejs (with npm)
 
After those are available just run:

```sh
npm install 
bower install
```


## Architecture decisions
The frontend ecosystem right now is diverse. There are things 
like [angularjs](https://github.com/angular/angular.js),
[facebook react](https://github.com/facebook/react),
[web components](http://www.w3.org/TR/components-intro/) and other frameworks. Each have their advantages and
 each have their drawbacks.
 
**This project uses a simulation of web components.**
It doesn't use the [webcomponents polyfill](https://github.com/webcomponents/webcomponentsjs) because it too cutting edge
and easily causes problems in modern browsers too.

Instead it uses 

This theme uses `webpack`. 

### Conventions
 - This project tries to follow the [12factor](http://12factor.net/) specs with addition of some 
 **REST**ful conventions provided by the [django-restful](https://github.com/obshtestvo-utilities/django-restful) package. 
 Other common good practices are also followed.
 Example conventions followed:
  - not in the way, only use what you want from the conventions, i.e. it can work as standard django install
  - handle all errors in one place
  - all requests and all calls should be as stateless as possible, pass what you need
  - all http methods should be simulatable 
  - response format should be extracted from http header but should also be simulatable
  - template names can be auto-detected based on Controller name and request method, so they should 
  - developers should have full control of data transformation in the template for any format
  - DRY, use single codebase where possible
  - always think modular, extract topical, not simply common logic
  - if requesting html (commonly web) always redirect after anything other than 'GET'
  - let html be html, don't use framework-specific or package-specific html generators (like form-element generators)  
  
### Specificity
 - Sensitive settings and those specific to deployment are retrieved from ENV variables or `.django` file in the `env`
 directory
 - If you are making a deployment you shouldn't have to modify the `src` directory. The `env` directory holds
   all environment-specific settings. If this is not the case please open an issue or submit a pull request. Changing
   things in `src` should only happen when you want to change the functionality of the project 
 - `env` directory holds settings specific to deployment environment:
  - server settings - debian install script, nginx sample, uwsgi sample, 
  - project dependencies descriptor
  - the actual project dependencies
  - environment-specific project settings
 - `src` directory is not "*just API*". It holds all sorts server-code and non-html templates
 - `themes` directory is where you can place your themes
 - The `user` and `security` apps has similar purposes 
   - The main difference between `user` app and `security` app is that `user` app includes the more project-specific 
   user things (like prepping pages and forms for login, profile editing, and making use of `security` app ).
   The `security` app also includes user-related stuff but it limits itself to more generic and security-related 
   logic (auth, validation, tokens, logout). 
   - The logic for the data checkpoint in the signup process is in `user` app instead of `security` app. The logic is closer to
   the security app because it handles required data before the user is allowed to register, **but** that data usually changes
   from project to project which goes against keeping `security` app the more reusable one



## Common scenarios
