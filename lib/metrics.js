
const client = require('prom-client');
const registry = new client.Registry();
const profiling = require('./profiling');
const pkg = require('../package.json');

let gauge = null;
let namespace = pkg.name;

function describe(node, parents, depth) {
    if (node.functionName) {
        // @todo: add a promfiler argument for verbose mode
        if (parents + node.functionName === "(root)#(idle)")
            return;
        if (parents + node.functionName === "(root)#(garbage collector)")
            return;
        if (parents + node.functionName === "(root)#(program)")
            return;
        if (node.functionName === "slash_metrics_handler")
            return;

	gauge.set({ signature: parents + node.functionName }, node.hitCount);
        parents += node.functionName + "#";
    }

    if (node.children)
        for (var i = 0; i < node.children.length; i++)
            describe(node.children[i], parents, depth + 1);
};

function clear() {
    registry.clear();
    gauge = new client.Gauge({
        name: namespace + '_cpu_profile',
        help: 'CPU stack trace samples',
        labelNames: [ 'signature' ],
        registers: [ registry ]
    });
};

function getMetrics() {
    const profile = profiling.resetProfiler();
    clear();
    describe(profile.head, '', 1);
//    profile.delete();
    return registry.metrics();
}

function setNamespace(ns) {
    namespace = ns;
}

module.exports = { getMetrics, setNamespace };
