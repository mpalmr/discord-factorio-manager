FROM node:14-alpine

RUN mkdir -p /usr/src/discord-factorio-manager
WORKDIR /usr/src/discord-factorio-manager

COPY package.json /usr/src/discord-factorio-manager
RUN npm i
COPY . /usr/src/discord-factorio-manager

CMD ["npm", "start"]
