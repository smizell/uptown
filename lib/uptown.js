var _ = require('lodash');

// This function borrows very heavily from Backbone's extend function
// See https://github.com/jashkenas/backbone/blob/938a8ff934fd4de4f0009f68d43f500f5920b490/backbone.js#L1821-L1852
exports.extend = function(protoProps, staticProps, gettersSetters) {
  var parent = this;
  var child;

  // Allow for specifying a constructor method for extend
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function() { return parent.apply(this, arguments); };
  }

  // Inherit prototype from parent along with any given methods or properties
  child.prototype = _.create(parent.prototype, protoProps);

  // Allow for defining getters and setters on new classes
  if (gettersSetters && _.isObject(gettersSetters)) {
    _.forEach(gettersSetters, function(value, key) {
      Object.defineProperty(child.prototype, key, value);
    });
  }

  // Add static methods and properties from the parent and from given static
  // properites (if provided);
  _.extend(child, parent, staticProps);

  // Attach the parent as a static property
  child.__parent = parent;

  // Provide a super function for calling the constructor of parents
  child.prototype.__super = function() {
    return child.__parent.apply(this, arguments);
  }

  // Provide a super function for calling methods of parents
  child.prototype.__superMethod = function(method) {
    if (!method) {
      throw new Error('Must provide a super method to call');
    }

    var superArgs = Array.prototype.slice.call(arguments, 1);

    // Call the method of the parent if it exists
    // Otherwise throw an error
    if (_.has(child.__parent.prototype, method)) {
      return child.__parent.prototype[method].apply(this, superArgs);
    } else {
      throw new Error('Cannot call super method \'' + method + '\' of parent');
    }
  }

  return child;
}

// Takes a class and adds extend to it
exports.extendify = function(klass) {
  klass.extend = exports.extend;
}

// Create a new class using extend
exports.createClass = function(protoProps, staticProps, gettersSetters) {
  var Base = function() {};
  exports.extendify(Base);
  return Base.extend(protoProps, staticProps, gettersSetters);
}
