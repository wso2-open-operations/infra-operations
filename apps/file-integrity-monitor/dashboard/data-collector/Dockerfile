# Use official slim Python image
FROM python:3.11-slim

# Ensure Python outputs logs immediately
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Copy application code
COPY app/ /app/

# Copy SSL certificates
COPY certs/ /app/certs/

# Install Python dependencies and create runtime folder
RUN pip install --no-cache-dir boto3 mysql-connector-python \
    && mkdir -p /app/centralised_bak

# Run the main Python script
CMD ["python", "data-collector.py"]
