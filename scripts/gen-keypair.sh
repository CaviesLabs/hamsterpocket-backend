#!/usr/bin/env bash

openssl genrsa -out keypair.pem 4096

openssl rsa -in keypair.pem -pubout -out publickey.crt

openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in keypair.pem -out private_key

rm -rf keypair.pem