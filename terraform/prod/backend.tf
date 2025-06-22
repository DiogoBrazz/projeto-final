terraform {
  backend "gcs" {
    bucket  = "bucket-tfstate-amira-462108"
    prefix  = "terraform/state"
  }
}