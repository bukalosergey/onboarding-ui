#!/bin/sh

find_and_replace () {
  echo "Replace in:"
  grep -rl "$1" /var/www/static/js/ | xargs echo 
  grep -rl "$1" /var/www/static/js/ | xargs sed -i -e "s@$1@$2@"
}

echo "=============================="
echo "1. replacing okta client id ..."
echo "=============================="

if [[ -z "$APP_OKTA_URL" ]]; then
  echo "APP_OKTA_URL not avaialble"
  okta_url=""
else
  okta_url="$APP_OKTA_URL"
fi
find_and_replace "DOCKER_APP_OKTA_URL" $okta_url


echo "=============================="
echo "2. replacing okta client id ..."
echo "=============================="

if [[ -z "$APP_OKTA_CLIENT_ID" ]]; then
  echo "APP_OKTA_CLIENT_ID not avaialble"
  okta_client_id=""
else
  okta_client_id="$APP_OKTA_CLIENT_ID"
fi
find_and_replace "DOCKER_APP_OKTA_CLIENT_ID" $okta_client_id

echo "=============================="
echo "3. replacing okta issuer ..."
echo "=============================="

okta_issuer_placeholder="okta_issuer_placeholder"

if [[ -z "$APP_OKTA_ISSUER" ]]; then
  echo "APP_OKTA_ISSUER not avaialble"
  okta_issuer=""
else
  okta_issuer="$APP_OKTA_ISSUER"
fi
find_and_replace "DOCKER_APP_OKTA_ISSUER" $okta_issuer

echo "=============================="
echo "4. replacing api base url ..."
echo "=============================="

if [[ -z "$APP_API_BASE_URL" ]]; then
  echo "APP_API_BASE_URL not avaialble"
  api_base_url=""
else
  api_base_url="$APP_API_BASE_URL"
fi
find_and_replace "DOCKER_APP_API_BASE_URL" $api_base_url

echo "===================================="
echo "5. replacing routing base path ..."
echo "===================================="

app_routing_base_path_placeholder="app_routing_base_path_placeholder"

if [[ -z "$APP_ROUTING_BASE_PATH" ]]; then
  echo "APP_ROUTING_BASE_PATH not avaialble"
  app_routing_base_path=""
else
  app_routing_base_path="$APP_ROUTING_BASE_PATH"
fi
find_and_replace "DOCKER_APP_ROUTING_BASE_PATH" $app_routing_base_path

echo "=============================="
echo "6. starting web server..."
echo "=============================="

nginx -g "daemon off;"