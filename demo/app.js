
const express = require('express');
const app = express();

function long_run(a, b, it) {
    let c = 0;
    for (var i = 0; i < it; i++)
        c += a ** b;
    return c;
}

app.get('/', function (req, res) {
    long_run(
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 1000000)   // 100m
    );
    res.send('Hello World!');
});

const port = 8080;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
