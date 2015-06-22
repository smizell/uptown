import { expect } from 'chai';
import { extendify } from './lib/uptown';

// Create A using functions and prototypes
const A = function() {
  this._x = 1;
  this.y = 1;
};
A.prototype.foo = function() { return 'bar'; }
A.prototype.hello = function() { return 'world'; }
extendify(A);

// Extend A with extendify
const B = A.extend({
  constructor: function() {
    A.call(this); // Equivalent to super
    this._x = 2;
  }
}, {
  staticMethod: function() {
    return 'static!';
  }
}, {
  x: {
    get: function() { return this._x; },
    set: function(value) { this._x = value; }
  }
});

// ES6 extending class B (created by uptown.extend)
class C extends B {}

// ES6 extending an ES6 class
class D extends C {
  constructor() {
    super();
    this._x = 4;
  }

  foo() {
    return 'baz';
  }

  hello() {
    return super.hello();
  }
}

// Create some instances
var b = new B();
var c = new C();
var d = new D();

// B instance assertions
expect(b.x).to.equal(2);
b.x = 3;
expect(b.x).to.equal(3);
expect(b.foo()).to.equal('bar');
expect(B.staticMethod()).to.equal('static!');
expect(b).to.be.instanceOf(A);
expect(b).to.be.instanceOf(B);

// C instance assertions
expect(c.x).to.equal(2);
c.x = 4;
expect(b.x).to.equal(3); // Make sure b.x hasn't changed
expect(c.x).to.equal(4);
expect(c.foo()).to.equal('bar');
expect(C.staticMethod()).to.equal('static!');
expect(c).to.be.instanceOf(A);
expect(c).to.be.instanceOf(B);
expect(c).to.be.instanceOf(C);

// D instance assertions
expect(d.foo()).to.equal('baz');
expect(d.y).to.equal(1); // Test super on constructor
expect(d.hello()).to.equal('world'); // Test super for methods
expect(d.x).to.equal(4);
expect(d).to.be.instanceOf(A);
expect(d).to.be.instanceOf(B);
expect(d).to.be.instanceOf(C);
expect(d).to.be.instanceOf(D);

process.exit()
