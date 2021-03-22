## Overview

This Yeoman generator creates Terraform project scaffolding a cloud project 

### Supported Cloud Providers
- Azure
- AWS

### Optionall installs the following
- python3-pip
- terraform 0.12.30

### Optionally configures the following
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
|   README.md
```

## Usage

```
terraform plan && terraform apply
```

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->

## Development

### Prerequisites

- [terraform](https://learn.hashicorp.com/terraform/getting-started/install#installing-terraform)
- [terraform-docs](https://github.com/segmentio/terraform-docs)
- [pre-commit](https://pre-commit.com/#install)
- [golang](https://golang.org/doc/install#install)
- [golint](https://github.com/golang/lint#installation)

### Configurations

- Configure pre-commit hooks
```sh
pre-commit install
```


- Configure golang deps for tests
```sh
> go get github.com/gruntwork-io/terratest/modules/terraform
> go get github.com/stretchr/testify/assert
```



### Tests

- Tests are available in `test` directory

- In the test directory, run the below command
```sh
go test
```



## Authors
Charlie Christina