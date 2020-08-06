FROM node:latest
WORKDIR /web
# COPY package.json /web
# COPY src/ /web/src
# COPY public/ /web/public
COPY start.sh /web

RUN npm i
RUN chmod 777 ./start.sh

EXPOSE 8081
CMD ["./start.sh"]

