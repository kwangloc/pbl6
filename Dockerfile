FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

# RUN mkdir -p /app/config
# COPY ./src/config/*.json /app/config/

ENV JWT_PRIVATE_KEY=lucas_1409

# container's port
EXPOSE 3000

WORKDIR /app/src
CMD ["node", "app.js"]
# CMD ["node", "./src/app.js"]
