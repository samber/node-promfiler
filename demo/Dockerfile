
FROM node:7

WORKDIR /app
CMD node-promfiler --sampling-interval=100 app.js

COPY . /app

RUN npm install -g promfiler@0.5.0 && \
    npm install
