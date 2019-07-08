function Vue(options) {
  var _this = this;
  var data = options.data;

  new Observer(data);

  Object.keys(data).forEach(function(key) {
    _this.proxyData(key, data);
  });

  new Complier(options.el, options, _this);
}

Vue.prototype.proxyData = function(key, data) {
  var _this = this;
  Object.defineProperty(_this, key, {
    get: function() {
      return data[key];
    },
    set: function(newValue) {
      data[key] = newValue;
    }
  })
}

window.Vue = Vue;