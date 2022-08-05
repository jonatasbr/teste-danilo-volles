FROM node:16-alpine as appdev

WORKDIR /home/api

COPY package.json ./
COPY package-lock.json ./

RUN npm install

CMD npm run start:dev
