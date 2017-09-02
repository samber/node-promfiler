
FROM node:7

WORKDIR /app
CMD node-promfiler app.js

COPY . /app

RUN npm install -g promfiler@0.4.0 && \
    npm install
