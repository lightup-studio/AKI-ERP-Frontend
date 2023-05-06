FROM node:latest as builder

WORKDIR /app

# COPY Project files into the container
COPY . .

# Remove node_modules and lock file
RUN rm -f -r ./node_modules
RUN rm -f ./package-lock.json
RUN rm -f ./yarn.lock

# Install dependencies
RUN yarn install

# Build the project
RUN yarn build

# =====

FROM nginx:stable-alpine as final

COPY --from=builder ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/aki-erp /app

EXPOSE 80
