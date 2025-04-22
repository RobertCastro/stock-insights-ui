#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Configurando la infraestructura en GCP con Terraform...${NC}"

# Inicializar Terraform
echo -e "${GREEN}Inicializando Terraform...${NC}"
terraform init

# Validar la configuración
echo -e "${GREEN}Validando la configuración de Terraform...${NC}"
terraform validate

# Mostrar el plan
echo -e "${GREEN}Generando plan de Terraform...${NC}"
terraform plan -out=tfplan

echo -e "${YELLOW}¿Deseas aplicar este plan? (s/n)${NC}"
read respuesta

if [[ $respuesta == "s" ]]; then
  # Aplicar la configuración
  echo -e "${GREEN}Aplicando la configuración de Terraform...${NC}"
  terraform apply tfplan
  
  echo -e "${GREEN}¡Configuración completada!${NC}"
  echo -e "${YELLOW}Revisa los outputs para obtener información sobre los recursos creados.${NC}"
else
  echo -e "${YELLOW}Operación cancelada.${NC}"
fi