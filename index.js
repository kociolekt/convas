var offset = 0;
var lastClear = 0;
var consoleObject;
var baseStyle = '';
var linesCache = [];
var styleHeap = [];
var alias = {};
var keywords = {};

var WHITESPACE = Array(1000).join(' ');

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
  styleHeap.push(
    styleHeap.pop()
    .replace('background-color: ', 'tmp: ')
    .replace('color: ', 'background-color: ')
    .replace('tmp: ', 'color: ')
  );
  return value;
};

function SYNTAX_REPLACE(value, head) {
  if (alias[head]) {
    return alias[head].reduce(SYNTAX_REPLACE, value);
  }

  var num = parseInt(head, 10);

  if (num) return value+WHITESPACE.slice(0, Math.max(num-value.length,0));

  switch(typeof keywords[head]){
    case 'string':
      styleHeap.push(styleHeap.pop() + keywords[head]);
      return value;
    
    case 'function':
      return keywords[head](value, head);

    case 'undefined':
      return value;
  }
}

function SYNTAX_REPLACE_ALL(_, heads, value) {
  styleHeap.push(baseStyle);
  var retval = heads.split('+').reduce(SYNTAX_REPLACE, '%c'+(value || '')+'%c');
  styleHeap.push(baseStyle);
  return retval;
}

function alias(name, value) {
  linesCache = [];
  if (typeof name === 'object') {
    Object.keys(name).forEach(function(key) {
      alias(key, name[key]);
    });
    return;
  }
  alias[name] = typeof value === 'string' ? value.split('+') : [value];
}

function use(console) {
  return consoleObject = console;
}

function clear(wait) {
  if (Date.now() - lastClear < wait) {
    return false;
  }
  consoleObject.clear();
  return true;
}

function write(line) {
  styleHeap = [];
  line = [
    '%c'+line.replace(SYNTAX, SYNTAX_REPLACE_ALL),
    baseStyle
  ].concat(styleHeap);
  consoleObject.log.apply(consoleObject, line);
  return line;
}

function line(line) {
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
    linesCache[offset] = [line, write(line)];
    return linesCache[offset][1];
  }

  return write.apply(exports, arguments);
}

function times(str, num) {
  if (typeof num === 'string') {
    var tmp = num;
    num = str;
    str = tmp;
  }
  return Array(num+1).join(str);
}

use(console);

exports.keywords = keywords;
exports.alias = alias;
exports.use = use;
exports.clear = clear;
exports.line = line;
exports.times = times;
