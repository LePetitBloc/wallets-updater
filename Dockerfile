FROM node:8.11.4-alpine
LABEL maintainer="jules@lepetitbloc.net"

RUN apk --update add openssh-client bash git
RUN npm install -g npm

WORKDIR /container-data
COPY . .

CMD ./docker-command.sh
