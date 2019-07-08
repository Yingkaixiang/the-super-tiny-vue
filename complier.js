function Complier(el, options, vm) {
  this.$options = options;
  this.$vm = vm;

  var root = document.querySelector(el);
  var fragment = document.createDocumentFragment();
  while(node = root.firstChild) {
    fragment.appendChild(root.firstChild);
  }

  var _this = this;

  // 遍历编译所有节点
  // 目前支持：数据绑定 事件绑定 双向绑定
  util.typedArray2Array(fragment.childNodes).forEach(function(node) {
    if (_this.isElementNode(node)) {
      _this.complieNode(node);
    } else if (_this.isTextNode(node) && _this.isTemplate(node.textContent)) {
      console.log("模板引擎");
    }
  });

  root.appendChild(fragment);
}

var EVENT_DIRECTIVE = "@";

// 是否为元素节点，如 div p
Complier.prototype.isElementNode = function(node) {
  return node.nodeType === 1;
}

// 是否为文本节点
Complier.prototype.isTextNode = function(node) {
  return node.nodeType === 3;
}

// 是否为模板引擎
Complier.prototype.isTemplate = function(str) {
  var reg = /\{\{(.*)\}\}/;
  return reg.test(str);
}

// 解析元素节点
Complier.prototype.complieNode = function(node) {
  var attrs = node.attributes;
  var text = node.textContent;
  var _this = this;

  // 解析指令
  util.typedArray2Array(attrs).forEach(function(attr) {
    var name = attr.name;
    var value = attr.value;

    // 解析事件指令
    if (_this.isEventDirective(name)) {
      var type = name.replace(EVENT_DIRECTIVE, "");
      var listener = _this.$options.methods[value];
      node.addEventListener(type, listener.bind(_this.$vm), false);
    }
  });

  // 解析模板引擎
  if (_this.isTemplate(text)) {
    function updater(text) {
      return function() {
        var matches = text.match(/\{\{(.*)\}\}/);
        // 在获取绑定的 data 时会将模板引擎和数据进行绑定
        node.textContent = _this.$options.data[matches[1].trim()];
      }
    }
    Dep.target = updater(text);
    updater(text)();
  }
}

// 是否为事件指令
Complier.prototype.isEventDirective = function(directive) {
  return directive.indexOf(EVENT_DIRECTIVE) === 0;
}

window.Complier = Complier;