
FROM node:24-alpine

ARG port
ARG service

ENV SERVICE=${service}
ENV PORT=${port}

WORKDIR /home/node/app

RUN chown -R node:node /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm ci

COPY --chown=node:node . .

# Сборка Auth
RUN npm run build:${SERVICE}

EXPOSE ${PORT}

CMD npm run 'start:api-backend'
