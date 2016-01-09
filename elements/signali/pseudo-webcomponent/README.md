## Specs
1. Trigger custom behaviour via custom *tag* or *attributes*.
1. Defines type of element (*tag* or *attribute*) by checking `type` string value.
1. Enables shadowdom-like templates (`..<content select="..."></content>..`)
1. Supports `register` method that will register custom element based on ES6 class definition and a name.
1. Supports `register` event that fires every time element is registered
1. Attaches `componentService` property to registered custom elements
1. Supports `upgrade` method that will inject custom behaviour if not loaded
1. Fires "domRendered" event after initial dom rendering is done