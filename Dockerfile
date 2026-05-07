FROM php:8.2-apache
# Install the headers module for Apache (good for security/routing)
RUN a2enmod rewrite
COPY . /var/www/html/
EXPOSE 80