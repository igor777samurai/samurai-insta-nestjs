FROM node:24-alpine

ARG port
ARG service

ENV SERVICE=${service}
ENV PORT=${port}

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:${SERVICE}

USER node

EXPOSE ${PORT}

CMD ["sh", "-c", "npm run start:${SERVICE}:prod"]