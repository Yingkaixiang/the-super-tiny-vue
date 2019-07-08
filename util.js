var util = {};

util.typedArray2Array = function(typedArray) {
  return [].slice.call(typedArray);
}

window.util = util;