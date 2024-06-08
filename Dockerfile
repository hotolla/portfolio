FROM node:20-alpine AS development

RUN apk add autoconf automake libtool make tiff jpeg zlib zlib-dev pkgconf nasm file gcc musl-dev

WORKDIR /app

COPY package*.json ./

RUN npm ci --include=dev --legacy-peer-deps

COPY . .

RUN npm run build

CMD npm run serve
