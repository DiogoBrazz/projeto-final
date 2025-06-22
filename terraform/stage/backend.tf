terraform {
  backend "gcs" {
    bucket  = "bucket-tfstate-diogo-462108"
    prefix  = "terraform/state"
  }
}