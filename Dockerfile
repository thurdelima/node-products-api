FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3010 27017

CMD ["npm", "run", "test"]
CMD ["npm", "run", "dev"]
