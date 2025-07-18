```bash
#!/bin/bash

# entrypoint.sh - Script to decode mounted password files and export as environment variables

set -e  # Exit on any error

# Define the paths to the mounted password files
DB_PASSWORD_FILE="/run/secrets/db_password"
DB_ADMIN_PASSWORD_FILE="/run/secrets/db_admin_password"

# Function to check if file exists and decode it
decode_password() {
    local file_path=$1
    local var_name=$2
    
    if [ -f "$file_path" ]; then
        echo "Reading and decoding $file_path..."
        # Decode base64 and export as environment variable
        decoded_value=$(base64 -d "$file_path")
        export "$var_name"="$decoded_value"
        echo "Successfully exported $var_name"
    else
        echo "Error: Password file $file_path not found!"
        exit 1
    fi
}

echo "Starting password decoding process..."

# Decode and export the passwords
decode_password "$DB_PASSWORD_FILE" "DB_PASSWORD"
decode_password "$DB_ADMIN_PASSWORD_FILE" "DB_ADMIN_PASSWORD"

echo "All passwords decoded and exported successfully!"

# Verify environment variables are set (without printing values)
echo "Environment variables check:"
echo "DB_PASSWORD: ${DB_PASSWORD:+SET}"
echo "DB_ADMIN_PASSWORD: ${DB_ADMIN_PASSWORD:+SET}"

# Execute the main application with all arguments passed to this script
echo "Starting main application..."
exec "$@"
```


```dockerfile
# Use your base image (replace with your actual base image)
FROM ubuntu:22.04

# Install any required packages
RUN apt-get update && apt-get install -y \
    coreutils \
    && rm -rf /var/lib/apt/lists/*

# Create the secrets directory in the container
RUN mkdir -p /run/secrets

# Copy your application files (replace with your actual application)
# COPY ./your-app /app
# WORKDIR /app

# Copy the entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Default command (replace with your application's command)
CMD ["echo", "Application started with decoded passwords"]
```


```bash
# Step 1: Create the secrets directory on the host VM
sudo mkdir -p /var/run/secrets

# Step 2: Create base64 encoded password files
# Replace 'your_db_password' and 'your_admin_password' with actual passwords

# For DB password
echo -n 'your_db_password' | base64 | sudo tee /var/run/secrets/db_password

# For DB admin password  
echo -n 'your_admin_password' | base64 | sudo tee /var/run/secrets/db_admin_password

# Step 3: Set appropriate permissions
sudo chmod 600 /var/run/secrets/db_password
sudo chmod 600 /var/run/secrets/db_admin_password

# Step 4: Build your Docker image
docker build -t your-app-name .

# Step 5: Run the container with mounted encrypted secrets and private key
docker run -d \
  --name your-container-name \
  --mount type=bind,source=/var/run/secrets/age-key.txt,target=/run/secrets/age-key.txt,readonly \
  --mount type=bind,source=/var/run/secrets/db_password.age,target=/run/secrets/db_password.age,readonly \
  --mount type=bind,source=/var/run/secrets/db_admin_password.age,target=/run/secrets/db_admin_password.age,readonly \
  your-app-name

# Alternative using -v flag (shorter syntax)
docker run -d \
  --name your-container-name \
  -v /var/run/secrets/age-key.txt:/run/secrets/age-key.txt:ro \
  -v /var/run/secrets/db_password.age:/run/secrets/db_password.age:ro \
  -v /var/run/secrets/db_admin_password.age:/run/secrets/db_admin_password.age:ro \
  your-app-name

# To run interactively for testing
docker run -it --rm \
  -v /var/run/secrets/age-key.txt:/run/secrets/age-key.txt:ro \
  -v /var/run/secrets/db_password.age:/run/secrets/db_password.age:ro \
  -v /var/run/secrets/db_admin_password.age:/run/secrets/db_admin_password.age:ro \
  your-app-name /bin/bash

# To verify the environment variables are set correctly
docker exec your-container-name printenv | grep DB_
```
