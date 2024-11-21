FROM node:20-alpine

# Install Python, build dependencies and other required tools
RUN apk add --no-cache python3 py3-pip make g++ bash util-linux

WORKDIR /app

COPY package.json yarn.lock ./

RUN rm -rf node_modules
# Install dependencies using Yarn
RUN yarn install 

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
