#!/bin/sh

function create_prod_file() {
echo "creating secrets script with key $1"
str="// eslint-disable-next-line import/no-anonymous-default-export
export default { STENOGRAPHY_API_KEY: \"$1\" }"
cat > secrets.production.js << EOF
$str
EOF
}

function set_nvm() {
    echo "setting nvm version to 14.17.0"
    . ~/.nvm/nvm.sh use 14.17.0
}

function build_it() {
    echo "building prod verion"
    npm run build
}

function zip_it() {
    echo "zipping with name $1 and api key $2"
    zip -r ./zipbuilds/build-$1.zip build
}

api_key=$2
if [ -z "$2" ]
  then
    echo "No api key supplied -- generating one"
    api_key=$(node generate-uuid.js)
    create_prod_file $api_key
    set_nvm
    build_it
    zip_it $1 $api_key
else
    create_prod_file $api_key
    set_nvm
    build_it
    zip_it $1 $api_key
fi



