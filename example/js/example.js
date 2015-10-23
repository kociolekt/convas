/* globals convas */

var width = 0;
var draw = function() {
  convas.clear();

  width++;
  if (width > 20) return convas.line('({blink:boom!})');
  convas.line('[{20+green:'+Array(width).join('=')+'>}]');
};

setInterval(draw, 200);
