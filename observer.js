function Observer(data) {
  this.walk(data);
}

Observer.prototype.walk = function(data) {
  var _this = this;
  Object.keys(data).forEach(function(key) {
    var value = data[key];
    if (typeof value === "object") {
      _this.walk(value);
    } else {
      _this.defineReactive(key, data[key], data);
    }
  })
}

Observer.prototype.defineReactive = function (key, oldValue, data) {
  var dep = new Dep();
  Object.defineProperty(data, key, {
    get: function() {
      dep.depend();
      return oldValue;
    },
    set: function(newValue) {
      oldValue = newValue;
      dep.notify();
    }
  })
}

function Dep() {
  this.subs = [];
}

Dep.prototype.depend = function() {
  if (Dep.target) {
    this.subs.push(Dep.target);
  }
}

Dep.prototype.notify = function() {
  this.subs.forEach(function(sub) {
    sub();
  });
}

Dep.target = null;

window.Observer = Observer;
window.Dep = Dep;