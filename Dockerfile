# Stage 1: Build Next.js app
FROM node:lts-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV APP_BASE_URL="https://erp.galleryaki.com/"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build
RUN pnpm -g install node-gyp
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Stage 2: Serve Next.js app with PM2 and NGINX
FROM node:lts-alpine

# Install PM2
RUN npm install -g pm2

# Copy Next.js build from previous stage
COPY --from=build /app/dist/apps/aki-erp /app/public

# Expose the listening port
EXPOSE 3000

# Start PM2 to serve the Next.js app
CMD ["pm2-runtime", "npm", "--", "start"]
