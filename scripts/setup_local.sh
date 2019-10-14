#!/bin/sh
# setup_local.sh

mkdir 'setup_local'
cd 'setup_local'

curl -H "Authorization:token $MM_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $MM_DEPLOYED'app.yaml'

rm -rf ../app.yaml
cp app.yaml ../app.yaml

cd ..
rm -rf 'setup_local'
