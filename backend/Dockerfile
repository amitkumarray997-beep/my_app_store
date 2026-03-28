# Use an official Node runtime as a parent image
FROM node:20-slim

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Create the uploads directory if it doesn't exist (it will be an ephemeral mount unless a volume is attached)
RUN mkdir -p uploads

# Expose the port the app runs on
# Railway will automatically set the PORT environment variable and override this if needed
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
