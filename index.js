
const server = require('./lib/server');
const metrics = require('./lib/metrics');
const profiling = require('./lib/profiling');

module.exports = {
    startServer: server.startServer,

    getMetrics: metrics.getMetrics,

    resetProfiler: profiling.resetProfiler,
    startProfiling: profiling.startProfiling,
    stopProfiling: profiling.stopProfiling,
};
