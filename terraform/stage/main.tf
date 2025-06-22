# Configura o provedor do Google Cloud
provider "google" {
  project = "lexical-rock-462108-d8" # <<< SEU ID DE PROJETO STAGE
  region  = "us-central1"
}

# Habilita a API do Kubernetes
resource "google_project_service" "gke_api" {
  service = "container.googleapis.com"
}

# Define e cria o cluster GKE
resource "google_container_cluster" "primary" {
  name     = "cluster-1" # Nome do cluster que queremos criar
  location = "us-central1-a"

  # Queremos remover os pools de nós padrão para ter mais controle
  remove_default_node_pool = true
  initial_node_count       = 1

  # Depende da API do GKE estar habilitada
  depends_on = [google_project_service.gke_api]
}

# Define e cria o nosso pool de nós customizado
resource "google_container_node_pool" "primary_nodes" {
  name       = "default-pool"
  location   = "us-central1-a"
  cluster    = google_container_cluster.primary.name
  node_count = 3

  node_config {
    machine_type = "e2-small"
    disk_type    = "pd-standard" 
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}