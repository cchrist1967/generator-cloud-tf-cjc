#!/bin/bash

echo "Project: " $PROJECT_NAME

# Parse Project name for Environment & Stack
IFS="_"
read -a strarr <<< $PROJECT_NAME
env=${strarr[0]}
stack=${strarr[1]}
echo "Env: $env"
echo "Stack: $stack"
unset IFS

# Copy backend config files
cp ./backends/${env}-backend backend
cp ./backends/${env}-${stack}-backend-key backend-key

# Copy parameter files
cp ./parameters/${env}.tfvars env.tfvars
cp ./parameters/${env}-${stack}.tfvars stack.tfvars
