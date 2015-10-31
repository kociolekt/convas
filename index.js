(function(exports) {
  var lastClear = 0;
  var inverse = false;
  var consoleObject;
  var baseStyle = 'display: inline-block; padding: 0; margin: 0; box-sizing: border-box;';
  var styleHeap = [];
  var aliases = {};
  var keywords = {};

  var BUFFER = [''];

  var WHITESPACE = Array(1000).join('\xa0');

  var SYNTAX = /\{([^:\}]+)(?::([^\{\}]*))?\}/g;

  keywords.bold = 'font-weight: bold;';
  keywords.italic = 'font-style: italic;';
  keywords.underline = 'text-decoration: underline;';
  keywords.blink = 'text-decoration: blink;';
  keywords.white = 'color: white;';
  keywords.grey = 'color: grey;';
  keywords.black = 'color: black;';
  keywords.blue = 'color: blue;';
  keywords.cyan = 'color: cyan;';
  keywords.green = 'color: green;';
  keywords.magenta = 'color: magenta;';
  keywords.red = 'color: red;';
  keywords.yellow = 'color: yellow;';

  keywords.inverse = function(value) {
    inverse = true;
    return value;
  };

  var SYNTAX_REPLACE = function(value, head) {
    if (aliases[head]) {
      return aliases[head].reduce(SYNTAX_REPLACE, value);
    }

    var num = parseInt(head, 10);

    if (num) return value+WHITESPACE.slice(0, Math.max(num-value.length,0));

    switch(typeof keywords[head]){
      case 'string':
        styleHeap.push(styleHeap.pop() + (
          inverse
          ? keywords[head].replace('color: ', 'background-color: ')
          : keywords[head]
        ));
        inverse = false;
        return value;

      case 'function':
        return keywords[head](value, head);

      case 'undefined':
        return value;
    }
  };

  var SYNTAX_REPLACE_ALL = function(_, heads, value) {
    styleHeap.push(baseStyle);
    var retval = '%c'+heads.split('+').reduce(SYNTAX_REPLACE, (value || ''))+'%c';
    styleHeap.push(baseStyle);
    return retval;
  };

  var alias = function(name, value) {
    if (typeof name === 'object') {
      Object.keys(name).forEach(function(key) {
        alias(key, name[key]);
      });
      return;
    }
    aliases[name] = typeof value === 'string' ? value.split('+') : [value];
  };

  var use = function(console) {
    return consoleObject = console;
  };

  var clear = function(wait) {
    if (Date.now() - lastClear < wait) {
      return false;
    }
    BUFFER = [''];
    consoleObject.clear();
    return true;
  };

  var write = function(value) {
    inverse = false;
    styleHeap = [];
    BUFFER[0] += '%c'+value.replace(SYNTAX, SYNTAX_REPLACE_ALL);
    BUFFER.push(baseStyle);
    BUFFER = BUFFER.concat(styleHeap);
    return BUFFER;
  };

  var line = function(value) {
    value += '\n';

    return write.apply(exports, arguments);
  };

  var draw = function() {
    consoleObject.log.apply(consoleObject, BUFFER);
    BUFFER = [''];
  };

  var redraw = function() {
    consoleObject.clear();
    draw();
  };

  var times = function(str, num) {
    if (typeof num === 'string') {
      var tmp = num;
      num = str;
      str = tmp;
    }
    return Array(num+1).join(str);
  };

  var base = function(style) {
    baseStyle = style;
  };

  use(console);

  exports.base = base;
  exports.keywords = keywords;
  exports.alias = alias;
  exports.use = use;
  exports.clear = clear;
  exports.write = write;
  exports.line = line;
  exports.draw = draw;
  exports.redraw = redraw;
  exports.times = times;

})(exports);
