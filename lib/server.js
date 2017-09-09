
const http = require('http');
const metrics = require('./metrics');
const profiling = require('./profiling');

const DEFAULT_HOSTNAME = '0.0.0.0';
const DEFAULT_PORT = 9142;
const DEFAULT_PATH = '/metrics';

function slash_metrics_handler(req, res) {
    res.statusCode = 200;
    res.end(metrics.getMetrics());
};

function slash_handler(req, res) {
    res.writeHead(301, {
        'Location': '/metrics'
    });
    res.end(`<html>
<head><title>Node profiling exporter</title></head>
<body>
<h1>Node profiling exporter</h1>
<p><a href="/metrics">Metrics</a></p>
</body>
</html>`);
}

function startServer(opts) {
    if (!opts)
        opts = {};

    const hostname = !!opts.hostname ? opts.hostname : DEFAULT_HOSTNAME;
    const port = !!opts.port ? parseInt(opts.port) : DEFAULT_PORT;
    const path = !!opts.path ? opts.path : DEFAULT_PATH;

    return new Promise( (resolve, reject) => {
        const server = http.createServer((req, res) => {
            const { method, url } = req;

            if (method === "GET" && url === path)
                return slash_metrics_handler(req, res);
            else if (method === "GET" && url === "/")
                return slash_handler(req, res);

            res.statusCode = 404;
            res.end();
            return;
        });

        server.on('clientError', (err, socket) => {
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });

        server.listen(port, hostname, () => {
            resolve('http://' + hostname + ':' + port + path);
        });
    });
}

module.exports = { startServer };
