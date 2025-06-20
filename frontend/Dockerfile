# frontend/Dockerfile
# Usamos uma imagem leve do Nginx
FROM nginx:1.25-alpine

# Copiamos os arquivos estáticos (html, js, css) para a pasta padrão do Nginx
COPY . /usr/share/nginx/html

# Expomos a porta 80, que é a porta padrão do Nginx
EXPOSE 80