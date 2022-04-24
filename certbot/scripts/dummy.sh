domain_path=/etc/letsencrypt/live/${DOMAIN_NAME}
mkdir -p "$domain_path"

openssl req -x509 -nodes -newkey rsa:4096 -days 1\
    -keyout "$domain_path/privkey.pem" \
    -out "$domain_path/fullchain.pem" \
    -subj "/CN=localhost"