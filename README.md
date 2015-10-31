# convas
Convas is [Clivas](https://github.com/mafintosh/clivas "Clivas Homepage") in chrome console.

![Tetris in chrome console](https://cloud.githubusercontent.com/assets/2782128/10860749/626df4a8-7f6d-11e5-83f7-693211d8f061.png "Convas in action!")

Available at npm:

```sh
npm install convas
```

# Usage
Althou Convas is very similar to Clivas, there are some differences.
Since version 2.x major difference is in draw method. It uses buffer to minimize blink effect and remove blank spaces between lines.
Convas is written as node module so it's best to use browserify or something similar.

```javascript
var convas = require('convas');
var width = 0;
var draw = function() {
  width++;
  if (width >= 20) {
    convas.line('({blink+red:boom!})');
    convas.redraw();
    return;
  }
  convas.line('|{20+white+inverse+green:'+Array(width).join('=')+'>}|');
  convas.redraw(); // In conva there is no need for clear()
};

setInterval(draw, 200);

```

# API

Not all Clivas methods are available. It's caused due to limitations of chrome console (lack of cursor).

- convas.base(str) - Sets base style for every element

- convas.alias(name, value) - Add an alias to the format pattern i.e. convas.alias('link', 'red+underline') enables you to use {link:http://google.com}

- convas.keyword(name, style/function) - Define custom style or functionality i.e. convas.keyword('redish', 'color: #ff3532') allows you to use {redish:warning message}

- convas.use(console) - Set console for use

- convas.clear() - Clears the console. Somehow deprecated. Use redraw() for better performance

- convas.line(str) - Write a line to inner buffer (accepts a format string as described above)

- convas.write(str) - Same as convas.line(str) except it does not add a newline

- convas.draw() - Draws inner buffer to console and clears inner buffer

- convas.redraw() - Clears console and draws inner buffer to console. Clears inner buffer after that

- convas.times(str, num) - Repeats str num times

# Changelog
## 2.0.0
- Minmized blink effect
- Removing blank spaces between lines
- convas.draw() metrod
- convas.redraw() method
- Bug fixes
