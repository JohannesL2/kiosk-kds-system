FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g concurrently

EXPOSE 5173
EXPOSE 4000

CMD ["npx", "concurrently", "node server.cjs", "npm run dev -- --host"]