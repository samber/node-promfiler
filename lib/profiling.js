
const profiler = require('v8-profiler');

let previousProfile = null;
let timeoutProfiling = null;
const timeoutProfilingDuration = 1000 * 60 * 5;

const DEFAULT_METRIC_NAMESPACE = 'promfiler';
const DEFAULT_SAMPLING_INTERVAL = 1000;


function resetProfiler() {
    if (timeoutProfiling)
        clearTimeout(timeoutProfiling);
    timeoutProfiling = setTimeout(resetProfiler, timeoutProfilingDuration);
    const profile = profiler.stopProfiling();
    profile.delete();
    profiler.deleteAllProfiles();
    profiler.startProfiling();
    return profile;
}

function startProfiling(opts) {
    if (!opts)
        opts = {};

    const samplingInterval = !!opts.samplingInterval ? opts.samplingInterval : DEFAULT_SAMPLING_INTERVAL;

    profiler.setSamplingInterval(samplingInterval);
    profiler.startProfiling();
    timeoutProfiling = setTimeout(resetProfiler, timeoutProfilingDuration);
};

function stopProfiling() {
    if (timeoutProfiling)
        clearTimeout(timeoutProfiling);
    const profile = profiler.stopProfiling();
    profile.delete();
    profiler.deleteAllProfiles();
}

module.exports = { resetProfiler, startProfiling, stopProfiling };
