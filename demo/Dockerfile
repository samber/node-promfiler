
FROM node:8

WORKDIR /app
CMD node-promfiler app.js

COPY . /app

RUN npm install -g promfiler && \
    npm install
