FROM nginx:latest

ENV RAILS_ROOT /var/www/lambdee-web-app

WORKDIR $RAILS_ROOT

RUN mkdir log

# Copy Nginx config template
COPY docker/nginx/reverse-proxy.conf /tmp/docker.nginx

# substitute variable references in the Nginx config template for real values from the environment
# put the final config in its place
RUN envsubst '$RAILS_ROOT' < /tmp/docker.nginx > /etc/nginx/conf.d/default.conf

EXPOSE 80

STOPSIGNAL SIGTERM

# Use the "exec" form of CMD so Nginx shuts down gracefully on SIGTERM (i.e. `docker stop`)
CMD [ "nginx", "-g", "daemon off;" ]
