# COMMON VARIABLES (only commons contain defaults)
# COMMON TAGS
variable "common_tags" {
  type = map(string)
  default = {
    Name    = "<%= name %>",
    Manager = "<%= manager %>",
    Market  = "<%= market %>",
    Project = "<%= project %>",
    Owner   = "<%= owner %>",
    Client  = "<%= client %>"
  }
}

# ENVIRONMENT-SPECIFIC VARIABLES (no defaults)
# ENVIRONMENT
variable "environment" {
  type = string
}
variable "region" {
  type = string
}
