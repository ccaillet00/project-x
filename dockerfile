# Base Image with Bun pre-installed

FROM oven/bun:canary-alpine

# Set the working directory 
WORKDIR /app

# Copy the Source Code
COPY . /app/

# Install dependencies
RUN bun install --production

# Start the Application
CMD ["bun", "run", "start"]