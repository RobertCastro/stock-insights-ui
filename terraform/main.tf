terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Variables
variable "project_id" {
  description = "ID del proyecto de Google Cloud"
  type        = string
}

variable "region" {
  description = "Región de Google Cloud"
  default     = "us-central1"
  type        = string
}

variable "repository_id" {
  description = "ID del repositorio de Artifact Registry"
  default     = "vue-stocks-repo"
  type        = string
}

variable "service_name" {
  description = "Nombre del servicio de Cloud Run"
  default     = "vue-stocks-app"
  type        = string
}

# Habilitar las APIs necesarias
resource "google_project_service" "artifact_registry" {
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_run" {
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

# Crear el repositorio de Artifact Registry
resource "google_artifact_registry_repository" "vue_app_repo" {
  location      = var.region
  repository_id = var.repository_id
  description   = "Repositorio Docker para la aplicación Vue de stocks"
  format        = "DOCKER"
  
  depends_on = [google_project_service.artifact_registry]
}

# Outputs
output "artifact_registry_repository" {
  value = "Repositorio de Artifact Registry: ${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.vue_app_repo.repository_id}"
}