# 🎫 Portal de Seguimiento de Incidencias

Sistema completo de gestión de tickets e incidencias construido con arquitectura serverless en AWS y frontend moderno con Next.js.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución Local](#ejecución-local)
- [Despliegue a AWS](#despliegue-a-aws)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Documentation](#api-documentation)
- [Principios Aplicados](#principios-aplicados)

## 📖 Descripción

Este proyecto implementa un portal completo para el seguimiento de incidencias (tickets) con las siguientes características:

- **Backend Serverless**: AWS Lambda + API Gateway + DynamoDB
- **Infraestructura como Código**: AWS SAM
- **Frontend Moderno**: Next.js 14 con App Router
- **Arquitectura Limpia**: Clean Architecture con separación de capas
- **Principios SOLID**: Aplicados en backend y frontend
- **Seguridad**: API Key para protección de endpoints
- **UI Responsive**: Interfaz adaptativa y funcional

## 🏗️ Arquitectura

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js 14 (App Router)                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │  Pages   │  │ Services │  │ Components│          │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘          │   │
│  └─────────────────────┼─────────────────────────────────┘   │
│                       │ HTTPS                                │
└───────────────────────┼───────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AWS API Gateway                          │   │
│  │  ┌──────────────┐  ┌──────────────┐                 │   │
│  │  │  API Key     │  │  Rate Limit  │                 │   │
│  │  │  Validation  │  │  & Throttle  │                 │   │
│  │  └──────────────┘  └──────────────┘                 │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAMBDA LAYER                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Lambda Handler (Presentation)                        │   │
│  │         │                                             │   │
│  │         ▼                                             │   │
│  │  Application Service (Use Cases)                      │   │
│  │         │                                             │   │
│  │         ▼                                             │   │
│  │  Domain Layer (Entities, Value Objects)              │   │
│  │         │                                             │   │
│  │         ▼                                             │   │
│  │  Infrastructure (Repository Implementation)          │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              DynamoDB                                  │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │  Table: tickets                               │    │   │
│  │  │  PK: id (String)                              │    │   │
│  │  │  GSI: StatusIndex (status)                    │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Separación de Capas (Clean Architecture)

**Backend:**
```
backend/
├── src/
│   ├── domain/              # Capa de Dominio (Núcleo)
│   │   ├── entities/        # Entidades de negocio
│   │   ├── value-objects/   # Objetos de valor
│   │   └── repositories/    # Interfaces (contratos)
│   │
│   ├── application/         # Capa de Aplicación
│   │   ├── use-cases/       # Casos de uso
│   │   ├── dtos/            # Data Transfer Objects
│   │   └── services/        # Servicios de aplicación
│   │
│   ├── infrastructure/      # Capa de Infraestructura
│   │   ├── persistence/     # Implementación DynamoDB
│   │   ├── http/            # Handlers Lambda
│   │   └── config/          # Configuración
│   │
│   └── shared/              # Utilidades compartidas
│       ├── errors/          # Errores personalizados
│       └── utils/           # Utilidades
```

**Frontend:**
```
frontend/
├── app/                     # App Router (Next.js 14)
├── components/
│   ├── ui/                 # Componentes base
│   └── tickets/            # Componentes de dominio
├── services/
│   ├── api/                # Implementación de servicios
│   └── interfaces/         # Interfaces (contratos)
├── types/                  # Tipos TypeScript
└── lib/                    # Utilidades
```

## 🛠️ Tecnologías

### Backend
- **AWS Lambda**: Runtime Node.js 20.x
- **API Gateway**: REST API con API Key
- **DynamoDB**: Base de datos NoSQL
- **AWS SAM**: Infraestructura como código
- **TypeScript**: Tipado estático

### Frontend
- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utility-first
- **React 18**: Biblioteca UI

## 📦 Requisitos Previos

- Node.js 20.x o superior
- AWS CLI configurado con credenciales
- AWS SAM CLI instalado
- Git
- Cuenta de AWS con permisos adecuados

### Instalación de AWS SAM CLI

**Windows:**
```bash
# Usando Chocolatey
choco install aws-sam-cli

# O descargar desde: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
```

**macOS:**
```bash
brew install aws-sam-cli
```

**Linux:**
```bash
# Ver documentación oficial de AWS SAM
```

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd PruebaTecnicaParqueExplora
```

### 2. Instalar dependencias del Backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../frontend
npm install
```

## ⚙️ Configuración

### Backend

El backend se configura automáticamente mediante `template.yaml`. Las variables de entorno se establecen en el template:

- `TICKETS_TABLE_NAME`: Nombre de la tabla DynamoDB (se genera automáticamente con el formato `tickets-{stack-name}`)

**Nota:** La API Key se genera automáticamente durante el despliegue. Ver sección de despliegue para obtener su valor.

### Frontend

Crear archivo `.env.local` en `frontend/`:

```env
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod
NEXT_PUBLIC_API_KEY=your-api-key-here
```

## 🏃 Ejecución Local

### Backend con SAM Local

```bash
cd backend

# Construir la aplicación
sam build

# Iniciar API local
sam local start-api

# La API estará disponible en http://localhost:3000
```

**Nota**: Para usar DynamoDB local, necesitas Docker y configurar DynamoDB Local. Alternativamente, puedes usar una tabla real de DynamoDB durante el desarrollo.

### Frontend

```bash
cd frontend

# Modificar .env.local con la URL del backend local
# NEXT_PUBLIC_API_URL=http://localhost:3000

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3001
```

## ☁️ Despliegue a AWS

### Backend

```bash
cd backend

# Construir
sam build

# Desplegar (primera vez - guiado)
sam deploy --guided

# Desplegar (siguientes veces)
sam deploy
```

Durante el despliegue guiado, se te pedirá:
- Stack Name: `tickets-backend`
- AWS Region: `us-east-1` (o tu región preferida)
- Confirm changes: `Y`
- Allow SAM CLI IAM role creation: `Y`
- Disable rollback: `N`
- Save arguments: `Y`

**Importante**: Después del despliegue, copia la URL de la API y la API Key de los outputs.

Para obtener el valor de la API Key:
```bash
aws apigateway get-api-key --api-key <ApiKeyId> --include-value --query value --output text
```

Reemplaza `<ApiKeyId>` con el valor del output `ApiKeyId` del despliegue.

### Frontend

#### Opción 1: Vercel (Recomendado)

```bash
cd frontend

# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en el dashboard de Vercel
```

#### Opción 2: AWS Amplify

1. Conectar repositorio en AWS Amplify Console
2. Configurar variables de entorno:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_API_KEY`
3. Desplegar automáticamente

## 📁 Estructura del Proyecto

```
.
├── backend/                 # Backend serverless
│   ├── src/                # Código fuente
│   │   ├── domain/         # Capa de dominio
│   │   ├── application/    # Capa de aplicación
│   │   ├── infrastructure/ # Capa de infraestructura
│   │   └── shared/         # Utilidades compartidas
│   ├── template.yaml       # SAM template
│   ├── samconfig.toml      # Configuración SAM
│   └── package.json
│
├── frontend/               # Frontend Next.js
│   ├── app/               # App Router
│   ├── components/        # Componentes React
│   ├── services/          # Servicios API
│   ├── types/            # Tipos TypeScript
│   └── package.json
│
├── PLAN_MAESTRO.md        # Plan detallado del proyecto
└── README.md             # Este archivo
```

## 📡 API Documentation

### Base URL

```
https://{api-id}.execute-api.{region}.amazonaws.com/prod
```

### Autenticación

Todas las peticiones requieren el header:
```
x-api-key: {your-api-key}
```

**Nota:** API Gateway requiere el header en minúsculas (`x-api-key`).

### Endpoints

#### 1. Crear Ticket

**POST** `/tickets`

**Request Body:**
```json
{
  "title": "Error en el sistema",
  "description": "No puedo acceder a mi cuenta",
  "priority": "HIGH",
  "createdBy": "usuario@example.com"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Error en el sistema",
    "description": "No puedo acceder a mi cuenta",
    "status": "OPEN",
    "priority": "HIGH",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "createdBy": "usuario@example.com"
  }
}
```

#### 2. Listar Tickets

**GET** `/tickets?status=OPEN`

**Query Parameters:**
- `status` (opcional): `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "title": "Error en el sistema",
      "description": "No puedo acceder a mi cuenta",
      "status": "OPEN",
      "priority": "HIGH",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3. Actualizar Estado de Ticket

**PATCH** `/tickets/{id}/status`

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Error en el sistema",
    "description": "No puedo acceder a mi cuenta",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:01:00.000Z"
  }
}
```

### Códigos de Error

- `400 Bad Request`: Error de validación
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

## 🎯 Principios Aplicados

### Clean Architecture

- **Separación de capas**: Domain, Application, Infrastructure
- **Independencia de frameworks**: El dominio no depende de AWS
- **Testabilidad**: Cada capa es testeable independientemente
- **Independencia de UI**: La lógica de negocio no depende de la presentación

### SOLID

#### Backend

- **S (Single Responsibility)**: Cada clase tiene una única responsabilidad
  - `CreateTicketUseCase`: Solo crea tickets
  - `DynamoTicketRepository`: Solo accede a datos
  - `TicketHandler`: Solo maneja HTTP

- **O (Open-Closed)**: Abierto a extensión, cerrado a modificación
  - Interfaces permiten cambiar implementaciones sin modificar código

- **L (Liskov Substitution)**: Implementaciones intercambiables
  - Cualquier implementación de `ITicketRepository` funciona igual

- **I (Interface Segregation)**: Interfaces específicas
  - `ITicketRepository` solo tiene métodos necesarios

- **D (Dependency Inversion)**: Depender de abstracciones
  - Use cases dependen de interfaces, no de implementaciones

#### Frontend

- **S**: Componentes con responsabilidad única
- **O**: Componentes base extensibles
- **L**: Componentes intercambiables
- **I**: Hooks y servicios específicos
- **D**: Servicios dependen de interfaces

## 📝 Postman Collection

Ver archivo `Tickets_API.postman_collection.json` para importar la colección completa de Postman con todos los endpoints.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es una prueba técnica y está disponible para uso educativo.

## 👤 Autor

Desarrollado como prueba técnica siguiendo principios de Clean Architecture y SOLID.

---

**¡Gracias por revisar este proyecto!** 🚀





