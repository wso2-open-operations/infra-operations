#   Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).

#  WSO2 LLC. licenses this file to you under the Apache License,
#  Version 2.0 (the "License"); you may not use this file except
#  in compliance with the License.
#  You may obtain a copy of the License at

#  http://www.apache.org/licenses/LICENSE-2.0

#  Unless required by applicable law or agreed to in writing,
#  software distributed under the License is distributed on an
#  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
#  specific language governing permissions and limitations
#  under the License. 

FROM php:8.2-apache

# Install mysqli
RUN docker-php-ext-install mysqli

# Apache config
COPY config/000-default.conf /etc/apache2/sites-available/000-default.conf
RUN a2ensite 000-default.conf \
    && a2enmod rewrite

# App code
COPY app/ /var/www/html/app/

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
