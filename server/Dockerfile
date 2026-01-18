FROM node:22-alpine
WORKDIR /app

# build the application
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run prisma:generate
RUN npm run build

# start the application (migrations run at every startup)
EXPOSE 3000
CMD ["sh", "-c", "npm run prisma:deploy && npm run start:prod"]
