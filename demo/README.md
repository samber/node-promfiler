
# Demo app

## Build

```
$ docker build -t samber/node-promfile-demo .
$ docker push samber/node-promfile-demo
```

## Run

```
$ docker run --rm -it -p 8080:8080 -p 9142:9142 samber/node-promfile-demo

# Open hello-world app
$ open localhost:8080

# Scrape metrics
$ curl localhost:9142/metrics
```

## Full setup with Prometheus and Grafana

```
$ git clone git@github.com:samber/grafana-flamegraph-panel.git
$ cd grafana-flamegraph-panel
$ docker-compose up

# Visit grafana
# username: admin / password: admin
$ open localhost:3000

$ Generating some data for the exporter
$ curl localhost:8080
$ curl localhost:8080
$ curl localhost:8080
```
