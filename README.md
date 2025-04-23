# Stock Insights UI

Una aplicación Vue 3 desarrollada para mostrar recomendaciones e información sobre acciones, desplegada en Google Cloud Platform.

## Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Configuración de Desarrollo Local](#configuración-de-desarrollo-local)
- [Integración con API](#integración-con-api)
- [Configuración de Infraestructura con Terraform](#configuración-de-infraestructura-con-terraform)
- [Despliegue en GCP](#despliegue-en-gcp)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Características

- Explorar recomendaciones y calificaciones de acciones
- Filtrar acciones por varios criterios
- Ver información detallada de acciones
- Seguir cambios de calificación y recomendaciones de brokers
- Diseño responsivo para escritorio y móvil

## Stack Tecnológico

- **Frontend**: Vue 3, TypeScript, Tailwind CSS
- **Build**: Vite
- **Testing**: Vitest
- **Contenedorización**: Docker
- **CI/CD**: GitHub Actions
- **Infraestructura como Código**: Terraform
- **Proveedor Cloud**: Google Cloud Platform (GCP)
- **Despliegue**: Cloud Run

## Configuración de Desarrollo Local

### Prerrequisitos

- Node.js 20.x o superior
- npm 9.x o superior
- Docker (opcional, para pruebas de contenedor)

### Instalación

1. Clonar el repositorio:

   ```sh
   git clone https://github.com/RobertCastro/stock-insights-ui
   cd stock-insights-ui
   ```

2. Instalar dependencias:

   ```sh
   npm install
   ```

3. Crear archivo de variables de entorno:

   ```sh
   # Crear archivo .env.development
   echo "VITE_API_URL=https://api.com" > .env.development
   ```

4. Ejecutar el servidor de desarrollo:

   ```sh
   npm run dev
   ```

5. La aplicación estará disponible en `http://localhost:5173/`

### Compilar para Producción

```sh
npm run build
```

### Ejecutar Pruebas

```sh
npm run test:unit
```

### Compilación con Docker (Pruebas Locales)

```sh
docker build -t stock-insights-ui:local .
docker run -p 8080:8080 stock-insights-ui:local
```

La aplicación estará disponible en `http://localhost:8080/`

## Integración con API

La aplicación se integra con la API de Recomendaciones de Acciones, que proporciona cambios en las calificaciones y recomendaciones de acciones. La API requiere autenticación mediante un token Bearer.

### Endpoints de API

- `GET /list` - Listar recomendaciones de acciones
  - Parámetros de consulta:
    - `next_page`: Clave de paginación para la siguiente página de resultados

Ejemplo de respuesta:

```json
{
  "items": [
    {
      "ticker": "BSBR",
      "target_from": "$4.20",
      "target_to": "$4.70",
      "company": "Banco Santander (Brasil)",
      "action": "upgraded by",
      "brokerage": "The Goldman Sachs Group",
      "rating_from": "Sell",
      "rating_to": "Neutral",
      "time": "2025-01-13T00:30:05.813548892Z"
    }
  ],
  "next_page": "AZEK"
}
```

## Configuración de Infraestructura con Terraform

La aplicación se despliega en Google Cloud Platform utilizando Terraform para la gestión de la infraestructura.

### Prerrequisitos

- Terraform 1.0.0 o superior
- Google Cloud SDK
- Proyecto GCP con facturación habilitada
- Cuenta de servicio con los permisos apropiados

### Configuración de la Infraestructura

1. Navegar al directorio terraform:

   ```sh
   cd terraform
   ```

2. Crear un archivo `terraform.tfvars` (puedes copiar desde el ejemplo):

   ```sh
   cp terraform.tfvars.example terraform.tfvars
   ```

3. Editar el archivo `terraform.tfvars` con tu ID de proyecto GCP:

   ```
   project_id = "tu-id-de-proyecto-gcp"
   region     = "us-central1"
   ```

4. Inicializar Terraform:

   ```sh
   terraform init
   ```

5. Aplicar la configuración de Terraform:

   ```sh
   terraform apply
   ```

   Alternativamente, usa el script proporcionado:

   ```sh
   ./apply-terraform.sh
   ```

### Componentes de Infraestructura

Terraform crea los siguientes recursos:

- **Repositorio de Artifact Registry**: Para almacenar imágenes Docker
- **Servicio de Cloud Run**: Para desplegar la aplicación Vue
- **Cuentas de Servicio**:
  - Cuenta de despliegue para GitHub Actions
  - Cuenta de runtime para Cloud Run
- **Permisos IAM**: Para despliegue y ejecución seguros

## Despliegue en GCP

La aplicación se despliega automáticamente en Google Cloud Platform usando GitHub Actions.

### Configuración de GitHub Actions

1. Configura los siguientes secretos de GitHub en tu repositorio:

   - `GCP_PROJECT_ID`: Tu ID de proyecto GCP
   - `GCP_SA_KEY`: Clave de cuenta de servicio codificada en Base64

2. Haz push a la rama principal para activar el despliegue:
   ```sh
   git push origin main
   ```

### Despliegue Manual

También puedes desplegar manualmente:

1. Construir la imagen Docker:

   ```sh
   docker build -t us-central1-docker.pkg.dev/[PROJECT_ID]/vue-stocks-repo/vue-stocks-app:latest .
   ```

2. Subir a Artifact Registry:

   ```sh
   docker push us-central1-docker.pkg.dev/[PROJECT_ID]/vue-stocks-repo/vue-stocks-app:latest
   ```

3. Desplegar en Cloud Run:
   ```sh
   gcloud run deploy vue-stocks-app \
     --image us-central1-docker.pkg.dev/[PROJECT_ID]/vue-stocks-repo/vue-stocks-app:latest \
     --region us-central1 \
     --platform managed \
     --service-account vue-stocks-runtime@[PROJECT_ID].iam.gserviceaccount.com \
     --allow-unauthenticated
   ```

## Capturas de Pantalla

![image](https://github.com/user-attachments/assets/f8307abc-a758-44ab-a406-bac936604045)


![image](https://github.com/user-attachments/assets/c3762ad3-a05a-4510-840c-d1f1b88ee7a3)


## Contribuciones

1. Haz fork del repositorio
2. Crea una rama de características: `git checkout -b feature/caracteristica-increible`
3. Haz commit de tus cambios: `git commit -m 'Añadir característica increíble'`
4. Haz push a la rama: `git push origin feature/caracteristica-increible`
5. Abre un Pull Request

## Autor

Robert Castro
