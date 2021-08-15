# Overview

- An array in Terraform's HCL just means declaring that same object multiple times. You can also declare it the normal
way, an array is just alternate sytnax
- You can use `data.terraform_remote_state.<...>` to access outputs from another terraform repository
  - This state for the other repository should live in an s3 bucket that you then connect as a remote state to your terraform repo
- To get existing IAM policies you can use the `data.aws_iam_policy` data resource and filter by name
  - This is useful when the console tries to automatically assign a policy to a role and you need to replicate that in 
  terraform

## Syntax

- `<<EOF` ... `EOF` is used to define multi-line strings (bash *here-doc* syntax)
  - This is a generic bash thing which is used to input multi-line strings to a command
