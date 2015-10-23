var offset = 0;
var lastClear = 0;
var consoleObject;

var linesCache = [];
var alias = {};

var WHITESPACE = Array(1000).join(' ');

var KEYWORDS = {};
KEYWORDS.bold = 'font-weight: bold;';
KEYWORDS.italic = 'font-style: italic;';
KEYWORDS.underline = 'text-decoration: underline;';
KEYWORDS.blink = 'text-decoration: blink;';
KEYWORDS.white = 'color: white;';
KEYWORDS.grey = 'color: grey;';
KEYWORDS.black = 'color: black;';
KEYWORDS.blue = 'color: blue;';
KEYWORDS.cyan = 'color: cyan;';
KEYWORDS.green = 'color: green;';
KEYWORDS.magenta = 'color: magenta;';
KEYWORDS.red = 'color: red;';
KEYWORDS.yellow = 'color: yellow;';

var STYLEHEAP = [];

var SYNTAX = /\{([^:\}]+)(?::([^\{\}]*))?\}/g;

var SYNTAX_REPLACE = function(value, head) {
  if (alias[head]) {
    return alias[head].reduce(SYNTAX_REPLACE, value);
  }

  var len = STYLEHEAP.length;
  var num = parseInt(head,10);

  if (num) return value+WHITESPACE.slice(0, Math.max(num-value.length,0));
  if (head === 'inverse') {
    STYLEHEAP[len-2] = STYLEHEAP[len-2].replace('color: ','background-color: ');
    return value;
  } else {
    if (!KEYWORDS[head]) return value;

    STYLEHEAP.push(KEYWORDS[head], '');
    
    return '%c'+value+'%c';
  }
};

var SYNTAX_REPLACE_ALL = function(_, heads, value) {
  return heads.split('+').reduce(SYNTAX_REPLACE, value || '');
};

exports.alias = function(name, value) {
  linesCache = [];
  if (typeof name === 'object') {
    Object.keys(name).forEach(function(key) {
      exports.alias(key, name[key]);
    });
    return;
  }
  alias[name] = typeof value === 'string' ? value.split('+') : [value];
};

exports.use = function(console) {
  return consoleObject = console;
};

exports.clear = function(wait) {
  if (Date.now() - lastClear < wait) {
    return false;
  }
  consoleObject.clear();
  return true;
};

exports.write = function (line) {
  line = [line
          .replace(SYNTAX, SYNTAX_REPLACE_ALL)
          .replace(SYNTAX, SYNTAX_REPLACE_ALL)
          ].concat(STYLEHEAP);
  consoleObject.log.apply(consoleObject, line);
  STYLEHEAP = [];
  return line;
};

exports.line = function(line) {
  offset++;
  line += '\n';

  if (
    arguments.length === 1 &&
    linesCache[offset] &&
    linesCache[offset][0] === line
  ) {
    consoleObject.log.apply(consoleObject, linesCache[offset][1]);
    return linesCache[offset][1];
  }
  if (arguments.length === 1) {
    linesCache[offset] = [line, exports.write(line)];
    return linesCache[offset][1];
  }

  return exports.write.apply(exports, arguments);
};

exports.times = function(str, num) {
  if (typeof num === 'string') {
    var tmp = num;
    num = str;
    str = tmp;
  }
  return Array(num+1).join(str);
};

exports.use(console);
