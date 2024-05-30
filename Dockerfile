# Use the official PHP image as a base image
FROM php:7.4-apache

# Install necessary PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copy application files to the container
COPY . /var/www/html

# Set the working directory
WORKDIR /var/www/html

# Enable Apache mod_rewrite (if needed)
RUN a2enmod rewrite

# Set the appropriate permissions for the Apache user
RUN chown -R www-data:www-data /var/www/html

# Expose port 80
EXPOSE 80
