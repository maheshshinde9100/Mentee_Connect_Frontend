# Build stage
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the files
COPY . .

# Build the React app
RUN npm run build

# Production stage: serve with nginx
FROM nginx:alpine

# Copy build output to nginx public folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
