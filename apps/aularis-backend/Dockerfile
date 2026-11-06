FROM node:24-alpine

ARG port
ARG service

ENV SERVICE=${service}
ENV PORT=${port}

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

# Временно для диагностики
RUN npm run

USER node

EXPOSE ${PORT}

CMD ["npm", "run", "start:aularis-backend"]