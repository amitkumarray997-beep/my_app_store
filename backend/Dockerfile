# ── Production-Grade Dockerfile ────────────────────────────────
FROM node:20

# Set labels for better container management
LABEL maintainer="AppStore-Dev"
LABEL description="High-performance backend for App Store with TensorFlow support"

# 1. Create app directory
WORKDIR /usr/src/app

# 2. Copy dependency manifests separately to leverage Docker layer caching
# This ensures that 'npm install' only runs when package.json changes.
COPY backend/package*.json ./

# 3. Install ALL dependencies (including dev) just once to ensure everything is locked
# then we'll run --omit=dev later if needed. But for this stack, 
# keeping it simple is better for stability with native AI modules.
RUN npm install --loglevel error

# 4. Copy the entire backend application code
# Since context is the repo root, we pull from 'backend/'
COPY backend/ .

# 5. Create persistent directories and set permissions
RUN mkdir -p uploads data && chmod -R 755 uploads data

# 6. Global Defaults
ENV NODE_ENV=production
ENV PORT=5000

# 7. Expose the port used by the service (Railway will ignore this and set its own, but it's best practice)
EXPOSE 5000

# 8. Use standard entrypoint
CMD [ "node", "server.js" ]
