# Configura o provedor do Google Cloud
provider "google" {
  project = "lexical-rock-462108-d8"
  region  = "us-central1"
}

# Habilita a API do Cloud Storage
resource "google_project_service" "storage_api" {
  service            = "storage-component.googleapis.com"
  disable_on_destroy = false
}

# Recurso que cria o nosso bucket de estado do Terraform
resource "google_storage_bucket" "tf_state" {
  # IMPORTANTE: Substitua pelo mesmo nome de bucket único que você definiu antes
  name          = "bucket-tfstate-diogo-462108" 
  location      = "US-CENTRAL1"
  force_destroy = false # Medida de segurança para não apagar sem querer

  uniform_bucket_level_access = true

  # Habilitar versionamento é uma excelente prática para arquivos de estado
  versioning {
    enabled = true
  }

  # Depende da API do Storage estar habilitada
  depends_on = [google_project_service.storage_api]
}