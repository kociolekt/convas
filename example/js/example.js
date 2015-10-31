/* globals convas */

var width = 0;
var draw = function() {
  width++;
  if (width >= 20) {
    convas.line('({blink+red:boom!})');
    convas.redraw();
    return;
  }
  convas.line('|{20+white+inverse+green:'+Array(width).join('=')+'>}|');
  convas.redraw();
};

setInterval(draw, 200);


