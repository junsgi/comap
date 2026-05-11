FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

EXPOSE 3977

CMD ["npm", "start"]

