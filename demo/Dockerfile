
FROM node:8

WORKDIR /app
CMD node-promfile app.js

COPY . /app

RUN npm install -g promfile && \
    npm install
