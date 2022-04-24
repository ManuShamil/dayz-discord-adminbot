
if [ "$DOMAIN_NAME" == "" ] || [ "$EMAIL" == "" ] \
|| [ "$APP_KEY" == "" ] || [ "$BOT_TOKEN" == "" ] || [ "$DISCORD_APP_ID" == "" ]\
|| [ "$CFTOOLS_APP_ID" == "" ] || [ "$CFTOOLS_SECRET" == "" ] \
|| [ "$CFTOOLS_SERVERID" == "" ] || [ "$CFTOOLS_BANLIST_ID" == "" ] \
|| [ "$DISCORD_MODERATOR_ROLE" == "" ]; then

    echo 'Failed to set value for $DOMAIN_NAME and $EMAIL'
    echo '###################################################'
    echo 'use `export DOMAIN_NAME="yourdomainname.com"`'
    echo 'use `export EMAIL="user@domain"`'
    echo 'use `export APP_KEY= discord application key`'
    echo 'use `export BOT_TOKEN= bot token`'
    echo 'use `export DISCORD_APP_ID= Discord Application id`'
    echo 'use `export DISCORD_MODERATOR_ROLE= Discord Moderator Role id`'
    echo 'use `export CFTOOLS_APP_ID= CFTools APPLICATION id`'
    echo 'use `export CFTOOLS_SECRET= APPLICATION SECRET`'
    echo 'use `export CFTOOLS_SERVERID= SERVER ID`'
    echo 'use `export CFTOOLS_BANLIST_ID= BANLIST ID`'

    exit 1
fi

# generate docker-compose.yaml with template

DOCKER_COMPOSE_TEMPLATE=$(cat docker-compose-template.yaml) # store contents of template.yaml to $TEMPLATE
DOCKER_COMPOSE_TEMPLATE_EVALED=""

# substitute variables onto template string
printf -v DOCKER_COMPOSE_TEMPLATE_EVALED "$DOCKER_COMPOSE_TEMPLATE" \
    "$DOMAIN_NAME" \
    "$APP_KEY" \
    "$BOT_TOKEN" \
    "$DISCORD_APP_ID" \
    "$DISCORD_MODERATOR_ROLE" \
    "$CFTOOLS_APP_ID" \
    "$CFTOOLS_SECRET" \
    "$CFTOOLS_SERVERID" \
    "$CFTOOLS_BANLIST_ID"


echo "$DOCKER_COMPOSE_TEMPLATE_EVALED" > docker-compose.yaml # create docker-compose.yaml using the template

# generate nginx conf with tempalte
NGINX_COMPOSE_TEMPLATE=$(cat ./nginx/conf.d.template/default.conf) # store contents of template.yaml to $TEMPLATE
NGINX_COMPOSE_TEMPLATE_EVALED=""

# substitute variables onto template string
printf -v NGINX_COMPOSE_TEMPLATE_EVALED "$NGINX_COMPOSE_TEMPLATE" \
    "$DOMAIN_NAME" \
    "$DOMAIN_NAME" \
    "$DOMAIN_NAME" \
    "$DOMAIN_NAME"

echo "$NGINX_COMPOSE_TEMPLATE_EVALED" > ./nginx/conf.d/default.conf # create docker-compose.yaml using the template

if [ ! -e "./certbot/store" ]; then
    mkdir -p "./certbot/store"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "./certbot/store/options-ssl-nginx.conf"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "./certbot/store/ssl-dhparams.pem"

fi

if [ ! -e "./certbot/store/live/$DOMAIN_NAME/fullchain.pem" ] || [ ! -e "./certbot/store/live/$DOMAIN_NAME/privkey.pem" ]; then
    docker-compose run --rm dummycertbot  # this generates a dummy certificate for our domain and stores it in ./certbot/store
fi

# deploy the app
docker-compose up --force-recreate -d nginx

# delete the dummy certificates
rm -Rf ./certbot/store/live/$DOMAIN_NAME
rm -Rf ./certbot/store/archive/$DOMAIN_NAME
rm -Rf ./certbot/store/renewal/$DOMAIN_NAME.conf

# create valid certicates from lets encrypt
docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    -d $DOMAIN_NAME \
    -d www.$DOMAIN_NAME \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot

echo

docker-compose down

echo

docker-compose up -d