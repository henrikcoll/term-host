FROM node:16-bullseye as client-build

WORKDIR /build
COPY ./client .
RUN npm install
RUN npm run build

FROM node:16-bullseye as server-build

WORKDIR /build
COPY package*.json ./
RUN npm install
COPY . .

FROM node:16-bullseye

WORKDIR /root
COPY ./setup.sh .
RUN ./setup.sh

COPY --from=server-build /build /usr/src/term-host
COPY --from=client-build /build/dist /usr/src/term-host/client/dist

WORKDIR /usr/src/term-host
EXPOSE 3000

CMD [ "npm", "run", "start" ]