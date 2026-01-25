FROM node:18-slim

WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy frontend code
COPY . .

# Expose port
EXPOSE 5173

# Start command (Vite dev server)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
