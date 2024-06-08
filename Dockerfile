FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm ci --include=dev --legacy-peer-deps

COPY . .

RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

CMD npm start
