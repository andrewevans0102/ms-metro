#!/bin/sh
# setup_commit.sh

mkdir 'setup_commit'
cd 'setup_commit'

curl -H "Authorization:token $MM_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $MM_EMPTY'app.yaml'

rm -rf ../app.yaml
cp app.yaml ../app.yaml

cd ..
rm -rf 'setup_commit'