FROM php:8.2-apache

# Install mysqli
RUN docker-php-ext-install mysqli

# Apache config
COPY config/000-default.conf /etc/apache2/sites-available/000-default.conf
RUN a2ensite 000-default.conf \
    && a2enmod rewrite

# App code
COPY . /var/www/html/app/

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
