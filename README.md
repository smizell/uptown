# Uptown

Simplify prototypical inheritance. Also tries to provide features for classes that you'd get with ES6 classes.

## Install

```sh
npm install uptown --save
```

### Usage

Use `extendify` to add the extend method to a class (**note**: it mutates the original class).

The `extend` class method takes three options arguments:

1. Object of instance properites
1. Object of static methods and properties
1. Object of getter and setter mutators

```js
var extendify = require('uptown').extendify;

var Original = function() {};
extendify(Original);

var SubClass = Original.extend({
  // Specify a constructor for the new class
  constructor: function() {}
}, {
  // Specify static methods and properties
  staticMethod: function() {}
}, {
  // Specify getters and setters for the new class
  foo: {
    get: function() {},
    set: function() {}
  }
});
```
