var _ = require('lodash');
var expect = require('../test-helper').expect;

var extend = require('../../lib/uptown').extend;

describe('Extend', function() {
  context('when a constructor is not provided', function() {
    var Original = function() {
      // For use with getters/setters
      this._x = false;
    }

    Original.prototype.testMethod = function() {
      return 'It works!';
    }

    Original.extend = extend;

    var Sub = Original.extend({
      foo: function() {
        return 'bar';
      }
    }, {
      staticMethod: function() {
        return 'Static methods!';
      },

      staticProp: 'Static props!'
    }, {
      x: {
        get: function() {
          return this._x;
        },
        set: function(value) {
          this._x = value;
        }
      }
    });

    var subInstance = new Sub();

    it('is an instance of the original', function() {
      expect(subInstance).to.be.instanceOf(Original);
    });

    it('is an instance of the sub class', function() {
      expect(subInstance).to.be.instanceOf(Sub);
    });

    it('has the methods of the original', function() {
      expect(subInstance).to.respondTo('testMethod');
      expect(subInstance.testMethod()).to.equal('It works!');
    });

    it('has its own methods', function() {
      expect(subInstance).to.respondTo('foo');
      expect(subInstance.foo()).to.equal('bar');
    });

    it('can define getters and setters', function() {
      expect(subInstance.x).to.be.false;
      subInstance.x = true;
      expect(subInstance.x).to.be.true
    });

    it('can define static methods and properties', function() {
      expect(Sub.staticMethod()).to.equal('Static methods!');
      expect(Sub.staticProp).to.equal('Static props!');
    });

    it('inherits static properties and methods from the parent', function() {
      expect(Sub.extend).to.equal(extend);
    });
  });

  context('when a constructor is provided', function() {
    var Original = function() {
      // For use when testing super calls
      this.y = true;
      this.fooCalled = false;
    }

    // Used on child method call when this is called via super
    Original.prototype.foo = function(value) {
      this.fooCalled = value;
    }

    Original.extend = extend;

    var Sub = Original.extend({
      constructor: function() {
        this.foo = 'bar';
      }
    });

    var subInstance = new Sub();

    it('calls the constructor', function() {
      expect(subInstance.foo).to.equal('bar');
    });

    context('when using super', function() {
      var Sub = Original.extend({
        // Testing calling super constructor
        // Parent constructor defines y and sets fooCalled for method tests
        constructor: function() {
          this.__super();
        },

        // Foo exists on parent class
        foo: function(value) {
          this.__superMethod('foo', value);
        },

        // Bar does not exist on parent class
        bar: function() {
          this.__superMethod('bar');
        }
      });

      var subInstance = new Sub();

      it('should have called the constructor of the parent', function() {
        expect(subInstance.y).to.be.true;
      });

      it('calls super for a method', function() {
        subInstance.foo(true);
        expect(subInstance.fooCalled).to.be.true;
      });

      it('throws an error when a super method does not exist', function() {
        expect(subInstance.bar).to.throw(Error);
      });
    });
  });
});
