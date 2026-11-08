FROM node:24-alpine

ARG port
ARG service

ENV SERVICE=${service}
ENV PORT=${port}

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:${SERVICE} && \
    echo "=== BUILD FILES ===" && \
    find dist -type f -name "main.js" -print

USER node

EXPOSE ${PORT}

CMD ["sh", "-c", "npm run start:${SERVICE}:prod"]