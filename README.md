# Profiling exporter to Prometheus for Node.js

## Building flame graphs

Please read: http://www.brendangregg.com/flamegraphs.html

Flame graph are oriented graphs (like a tree).

Flame graph are useful for analysing the time spent on each node (or function execution, in case of program profiling).

Flame graph are like a tree: Russian Dolls with multiple children.

Nodes have a "signature" (even if these are not exit nodes). This is the path from the <root> node to itself.

A signature shows only the depth dimension. Multiple signatures shape a graph.

Node value:
- Nodes in a flame graph have a **virtual weight**. This is usually the time spent on each local node.
- A node **real weight** is equal to the virtual weight, plus the sum of the children real weight (recursion).
- The virtual weight is equal to the real weight, minus all children real weight.
- We only export virtual weight. The real weight is implicit and can be computed easily.

## Troubleshooting

I observed huge memory leaks, increasing over long running profling. This is due to v8-profiler library (and prabably v8 :trollface:).
