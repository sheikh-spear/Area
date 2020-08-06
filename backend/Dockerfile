FROM node:latest
WORKDIR /backend
# COPY package.json /backend
# COPY lib/ /backend/lib/
# COPY middleware/ /backend/middleware/
# COPY routes/ /backend/routes/
# COPY backend.js /backend

RUN npm install
RUN npm install mysql ip

EXPOSE 8080

CMD ["node", "backend.js"]
