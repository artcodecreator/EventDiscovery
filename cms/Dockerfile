FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY cms/package.json ./
RUN npm install
COPY cms/ ./
ENV NODE_ENV=production
RUN npm run build
EXPOSE 1337
CMD ["npm","run","start"]
