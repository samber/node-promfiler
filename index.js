
const profiler = require('v8-profiler');
const path = require('path');
const client = require('prom-client');
const registry = new client.Registry();
let gauge = null;
let timeoutProfiling = null;
const timeoutProfilingDuration = 1000 * 60 * 5;

const resetProfiling = () => {
    if (timeoutProfiling)
        clearTimeout(timeoutProfiling);
    timeoutProfiling = setTimeout(resetProfiling, timeoutProfilingDuration);
    const profile = profiler.stopProfiling();
    profile.delete();
    profiler.startProfiling();
    return profile;
}

const initProfiling = () => {
    profiler.setSamplingInterval(100);
    profiler.startProfiling();
    timeoutProfiling = setTimeout(resetProfiling, timeoutProfilingDuration);
};

const clear = () => {
    registry.clear();
    gauge = new client.Gauge({ name: 'profiling', help: 'test', labelNames: [ 'signature' ], registers: [ registry ] });
};

const describe = (doc, parents, depth) => {
    if (doc.functionName) {
        if (parents + doc.functionName === "(root)#(idle)")
            return;
        if (parents + doc.functionName === "(root)#(garbage collector)")
            return;
        if (parents + doc.functionName === "(root)#(program)")
            return;

        //        console.log('-'.repeat(depth) + ' ' + doc.signature, doc.hitCount);
        //        console.log(parents + doc.functionName, doc.hitCount);
        gauge.set({ signature: parents + doc.functionName }, doc.hitCount);
        parents += doc.functionName + "#";
    }
//    else
//        console.log('-'.repeat(depth) + ' ' + doc.url, doc.hitCount);

    if (doc.children)
        for (var i = 0; i < doc.children.length; i++)
            describe(doc.children[i], parents, depth + 1);
};






const slash_metrics_handler = () => {
    const profile = resetProfiling();
    clear();
    describe(profile.head, "", 1);
    return registry.metrics();
}

const hostname = "0.0.0.0"
const port = 9142;

const http = require('http');

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === "GET" && url === "/metrics") {
        res.statusCode = 200;
        const metrics = slash_metrics_handler();
        res.end(metrics);
        return;
    } else if (method === "GET" && url === "/") {
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
	return;
    }

    res.statusCode = 404;
    res.end();
    return;
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(port, hostname, () => {
    initProfiling();
    executeApp();
});


const executeApp = () => {
    const appModule = path.resolve(path.join(process.argv[2]));
    console.info("\n");
    console.info("*********************************************");
    console.info('*****  Profiler listening on ' + hostname + ":" + port);
    console.info("*****  Executing:", appModule);
    console.info("*********************************************");
    console.info("\n");
    process.argv.shift();
    process.argv.shift();
    require(appModule);
}
