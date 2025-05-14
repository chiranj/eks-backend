FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY app.js ./

# Create directory for secret mounting
RUN mkdir -p /mnt/secrets

EXPOSE 3000

CMD ["node", "app.js"]
