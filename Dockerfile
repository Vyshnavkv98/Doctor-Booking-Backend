FROM node:18

WORKDIR /app

COPY ./dist ./dist

COPY package*.json ./

COPY nodemon.json ./

COPY .env ./

RUN npm install

EXPOSE 5000

CMD ["npm", "start"]
