# Yeoman Generator - Cloud Terraform Scaffolding
## Overview

This Yeoman generator creates Terraform project scaffolding a cloud project 

### Supported Cloud Providers
- Azure
- AWS

### Actions taken by the generator

#### Prompting
- Asks for values used for common cloud resource tags
- Asks what environments will be supported
    - choices include dev, prod, qa, sit, uat
- Asks for target cloud provider
- Asks for target cloud provider region

#### Writing
- Creates Cloud Backend Configuration Files (opinionated backend naming convention)
- Creates Parameter Files
- Creates Skeleton Terraform main, vatiables, and output files

#### Installing
- initializes the local git repo (with either git or git flow)

#### Optionally installs the following
- python3-pip
- terraform 0.12.30

#### Optionally configures the following
- Git Flow
- Atlantis Workflow
- Pre-Commit Hooks for Terraform

### The resulting project will have the following structure:

```
project
└───backends
|   |   dev-backend (default)
|   |   dev-project-backend-key (default)
|   |   prod-backend (default)
|   |   prod-project-backend-key (default)
|   |   qa-backend
|   |   qa-project-backend-key
|   |   sit-backend
|   |   sit-project-backend-key
|   |   uat-backend
|   |   uat-project-backend-key
└───parameters
|   |   dev-project.tfvars (default)
|   |   dev.tfvars (default)
|   |   prod-project.tfvars (default)
|   |   prod.tfvars (default)
|   |   qa-project.tfvars 
|   |   qa.tfvars
|   |   sit-project.tfvars 
|   |   sit.tfvars
|   |   uat-project.tfvars 
|   |   uat.tfvars
└───scripts
|   |   prep-tf-env.sh (optional)
|   .gitignore
|   .pre-commit-config.yaml (optional)
|   atlantis.yaml (optional)
|   main.tf
|   README.md
|   variables.tf
```

## Usage

<ol>
<li> mkdir your_project_directory
<li> cd your_project_directory
<li> npm install -g generator-cloud-tf-cjc
<li> yo cloud-tf-cjc
</ol>

## Development
- TBD

### Prerequisites

- npm installed
- Yeoman installed
- Before the generated terraform project is initialized, backend storage must exist that matches the naming convention used in the backend config files

### Configurations

- TBD



### Tests

- TBD



## Authors
Charlie Christina