FROM node:20-alpine

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Expose Vite dev port
EXPOSE 3000

# Run dev server with hot reload
CMD ["npm", "run", "dev"]
