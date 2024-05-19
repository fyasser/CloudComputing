server {
    listen 80;
    listen [::]:80;
    root /var/www/html/<file name>;
    server_name mydomain.com ;
}
 location / {
        try_files $uri /index.html;
    }
		error_page 404 /index.html;
    location ~* \\\\.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires max;
        log_not_found off;
    }

