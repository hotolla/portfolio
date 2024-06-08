FROM node:14-alpine AS development

WORKDIR /app

# Copy package.json and package-lock.json if it exists
COPY package*.json ./

# Install dependencies, generating package-lock.json if it's not present
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

CMD ["npm", "start"]
