# Use official Python runtime as a parent image
# Slim version for smaller size
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies needed for unstructured / magic
RUN apt-get update && apt-get install -y \
    libmagic-dev \
    libmagic1 \
    poppler-utils \
    tesseract-ocr \
    libreoffice \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Cloud Run invokes the container with PORT=8080 by default
# We expose it for documentation
EXPOSE 8080

# Run the application
# We use the array form to ensure signals are passed correctly
CMD ["python", "main.py"]
