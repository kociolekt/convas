/* globals convas */
/*
var width = 0;
var draw = function() {
  convas.clear();

  width++;
  if (width > 20) return convas.line('({blink:boom!})');
  convas.line('[{20+green+inverse:'+Array(width).join('=')+'>}]');
};

setInterval(draw, 200);
*/
convas.write('hello world (#frame 1)');
convas.write('{red:also} {green:colors}!');
convas.write('{red:i am red} and {blue: i am blue}');
convas.write('{white+inverse+green+inverse:i am inversed}');
convas.write('[{10:===>}]');
