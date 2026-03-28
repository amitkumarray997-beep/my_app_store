# Use an official Node runtime as a parent image
FROM node:20-slim

# Set the working directory to /app
WORKDIR /app

# Copy package files from the backend directory (since context is root)
COPY backend/package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy the rest of the backend code
COPY backend/ .

# Create the uploads directory
RUN mkdir -p uploads

# Expose the port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
