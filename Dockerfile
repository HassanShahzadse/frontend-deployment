# Base image with Node 18
FROM node:18

# Set working directory
WORKDIR /app

# Copy only package files first to install deps
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Build the app
RUN npm run build

# Use a minimal server to serve the app
RUN npm install -g serve

# Default command
CMD ["serve", "-s", "build"]
