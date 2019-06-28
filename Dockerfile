FROM nginx:1.15.2-alpine

RUN apk add --no-cache dos2unix grep sed

COPY ./build /var/www
COPY nginx.conf /etc/nginx/nginx.conf

COPY docker-entrypoint.sh /
RUN dos2unix docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh 

EXPOSE 5000
#ENTRYPOINT ["nginx","-g","daemon off;"]
ENTRYPOINT ["./docker-entrypoint.sh"]