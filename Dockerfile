FROM node:14-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

CMD npm run serve
