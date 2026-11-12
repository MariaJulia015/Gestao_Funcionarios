# Servidor web leve para desenvolvimento do projeto (HTML + JavaScript)
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
