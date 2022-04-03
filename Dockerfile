FROM node:16-bullseye

WORKDIR /usr/src/term-host

COPY package*.json ./

RUN npm install
COPY . .

RUN ./setup.sh

EXPOSE 3000
CMD [ "npm", "run", "start" ]