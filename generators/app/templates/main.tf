# PROVIDERS
provider "azurerm" {
  features {}
  version = "~> 2.50"
}

# TERRAFORM CONFIG
terraform {
  required_version = "=0.12.30"
  backend "azurerm" {}
}

# RESOURCES

