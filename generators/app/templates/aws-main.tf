# PROVIDERS
provider "<%= cloud_provider %>" {
  region  = "<%= region %>"
  version = "~> <%= cloud_provider_version %>"
}

# TERRAFORM CONFIG
terraform {
  required_version = "=0.12.30"
  backend "<%= tf_backend %>" {}
}

# RESOURCES

