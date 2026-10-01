FROM node:20-alpine

WORKDIR /app

# Zero external npm dependencies required (uses native Node.js 20+ fetch and net)
COPY package.json ./
COPY index.js ./
COPY test-telegram.js ./

ENV NODE_ENV=production

CMD ["node", "index.js"]
