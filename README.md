# convas
Clivas in chrome console.
[Click here to learn more about Clivas](https://github.com/mafintosh/clivas "Clivas Homepage").
Available at npm:
npm install convas
# Usage
Just use convas insted of clivas. It's node module so it's best to use browserify or something similar.
```javascript
var convas = require('convas');

var frame = 0;

setInterval(function() {
    convas.clear(); // clears the canvas
    convas.line('hello world (#frame '+frame+')');
    convas.line('{red:also} {green:colors}!');
    frame++;
}, 200);
```
Visit [Clivas Homepage](https://github.com/mafintosh/clivas "Clivas Homepage") for more examples.

# API

No all clivas methods are available. It's caused due to limitations of chrome console (lack of cursor).

- convas.clear() - Clears the console.

- convas.line(str) - Write a line (accepts a format string as described above)

- convas.write(str) - Same as convas.line(str) except it does not add a newline

- convas.alias(name, value) - Add an alias to the format pattern i.e. convas.alias('link', 'red+underline') enables you to use {link:http://google.com}

# TODO

- fix: 20+green+underline not beeing green
