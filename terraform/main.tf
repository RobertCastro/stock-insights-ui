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
resource "google_project_service" "apis" {
  for_each = toset([
    "artifactregistry.googleapis.com",
    "run.googleapis.com",
    "iam.googleapis.com"
  ])
  
  service            = each.value
  disable_on_destroy = false
}

# 1. Cuenta de servicio para GitHub Actions (Deployer)
# Esta cuenta ya existe y ha sido importada con:
# terraform import google_service_account.github_deployer projects/stock-insights-457603/serviceAccounts/github-actions-deployer@stock-insights-457603.iam.gserviceaccount.com
resource "google_service_account" "github_deployer" {
  account_id   = "github-actions-deployer"
  display_name = "GitHub Actions Deployer"
  description  = "Cuenta de servicio utilizada por GitHub Actions para desplegar"
  
  depends_on = [google_project_service.apis]
}

# 2. Cuenta de servicio para el runtime de Cloud Run
resource "google_service_account" "cloudrun_runtime" {
  account_id   = "vue-stocks-runtime"
  display_name = "Vue Stocks Runtime Service Account"
  description  = "Cuenta de servicio utilizada por el servicio de Cloud Run en tiempo de ejecución"
  
  depends_on = [google_project_service.apis]
}

# 3. Crear el repositorio de Artifact Registry
resource "google_artifact_registry_repository" "vue_app_repo" {
  location      = var.region
  repository_id = var.repository_id
  description   = "Repositorio Docker para la aplicación Vue de stocks"
  format        = "DOCKER"
  
  depends_on = [google_project_service.apis]
}

# 4. Permisos para GitHub Actions Deployer
# Permiso para desplegar a Cloud Run
resource "google_project_iam_member" "deployer_cloudrun_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.github_deployer.email}"
}

# Permiso para subir imágenes a Artifact Registry
resource "google_project_iam_member" "deployer_artifact_admin" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.github_deployer.email}"
}

# 5. Permiso para que GitHub Actions Deployer actúe como la cuenta de runtime
resource "google_service_account_iam_member" "deployer_actas_runtime" {
  service_account_id = google_service_account.cloudrun_runtime.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.github_deployer.email}"
}

# 6. Crear clave para la cuenta de servicio de GitHub Actions 
# Si necesitas generar una nueva clave, descomenta este bloque
# resource "google_service_account_key" "github_deployer_key" {
#   service_account_id = google_service_account.github_deployer.name
# }

# Outputs
output "artifact_registry_repository" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.vue_app_repo.repository_id}"
}

output "github_deployer_email" {
  value = google_service_account.github_deployer.email
}

output "cloudrun_runtime_email" {
  value = google_service_account.cloudrun_runtime.email
}

# output "github_deployer_key" {
#   value     = google_service_account_key.github_deployer_key.private_key
#   sensitive = true
# }