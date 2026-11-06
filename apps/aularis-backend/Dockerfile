FROM node:22-alpine

ARG port
ARG service

ENV SERVICE=${service}
ENV PORT=${port}

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install -g npm@10.9.4

RUN npm install

COPY . .

# Временно для диагностики
RUN npm run

# Build будет добавлен после проверки package.json

USER node

EXPOSE ${PORT}

CMD ["npm", "run", "start:aularis-backend"]