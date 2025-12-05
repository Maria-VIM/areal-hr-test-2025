FROM node:20-alpine
LABEL authors="maria"

WORKDIR /api
COPY package*.json ./
RUN npm install
RUN mkdir -p /api/uploads/passports
COPY . .
EXPOSE 3000

CMD ["sh", "-c", "npm run migrate:up && npm start"]


