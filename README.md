# Live profiling exporter for Node.js and Prometheus

## Building flame graphs

[![Flame Graph Example](https://media.giphy.com/media/l41JMjBaxrZw1bqpi/giphy.gif)](http://spiermar.github.io/d3-flame-graph/)

Please read [Brendan Gregg's post](http://www.brendangregg.com/flamegraphs.html)

Flame graph are oriented graphs (like a tree).

Flame graph are useful for analysing the time spent on each node (or function execution, in case of program profiling).

Nodes have a "signature" (even if these are not exit nodes). This is the path from the <root> node to itself.

A signature shows only the depth dimension. Multiple signatures shape a graph.

Node value:
- Nodes in a flame graph have a **virtual weight**. This is usually the time spent on each local node.
- A node **real weight** is equal to the virtual weight, plus the sum of the children real weight (recursion).
- The virtual weight is equal to the real weight, minus all children real weight.
- We only export virtual weight. The real weight is implicit and can be computed easily.

## HowTo

### Running

```
$ npm install -g promfiler
$ promfiler app.js
```

This exposes a /metrics route on 0.0.0.0:9142

### Configuring Prometheus

```
scrape_configs:
  - job_name: 'test'
    scrape_interval: 30s
    scrape_timeout: 3s
    static_configs:
     - targets: ['localhost:9142']
```

### Visualize flame graphs

Install [grafana-flamegraph-panel](https://github.com/samber/grafana-flamegraph-panel) into your Grafana instance.

## Output format

```
$ promfiler demo/app.js

$ curl localhost:9142
```

```
# HELP profiling test
# TYPE profiling gauge
profiling{signature="(root)"} 0
profiling{signature="(root)#parserOnHeadersComplete"} 4
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming"} 2
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit"} 1
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit#emitTwo"} 1
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit#emitTwo#http.createServer"} 2
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit#emitTwo#http.createServer#end"} 3
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit#emitTwo#http.createServer#end#_implicitHeader"} 0
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit#emitTwo#http.createServer#end#_implicitHeader#writeHead"} 1
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit#emitTwo#http.createServer#end#_implicitHeader#writeHead#_storeHeader"} 0
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit#emitTwo#http.createServer#end#_implicitHeader#writeHead#_storeHeader#utcDate"} 0
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit#emitTwo#http.createServer#end#_implicitHeader#writeHead#_storeHeader#utcDate#exports._unrefActive"} 0
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit#emitTwo#http.createServer#end#_implicitHeader#writeHead#_storeHeader#utcDate#exports._unrefActive#insert"} 0
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit#emitTwo#http.createServer#end#_implicitHeader#writeHead#_storeHeader#utcDate#exports._unrefActive#insert#createTimersList"} 1
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit#emitTwo#http.createServer#end#write"} 1
profiling{signature="(root)#parserOnHeadersComplete#parserOnIncoming#emit#emitTwo#http.createServer#end#write#_send"} 0
...
```

## Troubleshooting

I observed huge memory leaks, increasing over long running profling. This is due to v8-profiler library (and probably v8 :trollface:). You should not use it in production until it's fixed (or contribute !).
