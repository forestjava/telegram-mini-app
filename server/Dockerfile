FROM node:22-alpine
WORKDIR /app

# build the application
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run prisma:generate
RUN npm run build

# apply migrations
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
RUN npm run prisma:deploy

# start the application
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
