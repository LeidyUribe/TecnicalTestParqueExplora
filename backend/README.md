# Backend - Portal de Seguimiento de Incidencias

Backend serverless construido con AWS Lambda, API Gateway y DynamoDB siguiendo Clean Architecture y principios SOLID.

## 🏗️ Arquitectura

El backend está organizado en capas siguiendo Clean Architecture:

```
src/
├── domain/              # Capa de Dominio (Núcleo)
│   ├── entities/        # Entidades de negocio
│   ├── value-objects/   # Objetos de valor
│   └── repositories/    # Interfaces (contratos)
│
├── application/         # Capa de Aplicación
│   ├── use-cases/       # Casos de uso
│   ├── dtos/            # Data Transfer Objects
│   └── services/        # Servicios de aplicación
│
├── infrastructure/      # Capa de Infraestructura
│   ├── persistence/     # Implementación DynamoDB
│   ├── http/            # Handlers Lambda
│   └── config/          # Configuración
│
└── shared/              # Utilidades compartidas
    ├── errors/          # Errores personalizados
    └── utils/           # Utilidades
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20.x
- AWS CLI configurado
- AWS SAM CLI instalado

### Instalación

```bash
npm install
```

### Desarrollo Local

```bash
# Construir
sam build

# Iniciar API local
sam local start-api

# La API estará en http://localhost:3000
```

### Despliegue

```bash
# Construir
sam build

# Desplegar (primera vez)
sam deploy --guided

# Desplegar (siguientes veces)
sam deploy
```

## 📡 Endpoints

Ver documentación completa en el README principal.

## 🧪 Testing

```bash
npm test
```

## 📝 Estructura de Código

### Domain Layer

Contiene la lógica de negocio pura, sin dependencias externas:

- **Entities**: `Ticket` - Entidad principal
- **Value Objects**: `TicketStatus`, `TicketPriority`
- **Repositories**: `ITicketRepository` - Interface del repositorio

### Application Layer

Contiene los casos de uso y DTOs:

- **Use Cases**: 
  - `CreateTicketUseCase`
  - `GetTicketsUseCase`
  - `UpdateTicketStatusUseCase`
- **DTOs**: Objetos de transferencia de datos

### Infrastructure Layer

Implementaciones concretas:

- **Persistence**: `DynamoTicketRepository` - Implementación DynamoDB
- **HTTP**: Handlers Lambda para cada endpoint
- **Config**: Configuración de entorno

## 🔒 Seguridad

- API Key requerida en todas las peticiones
- Validación de entrada en todos los endpoints
- Manejo seguro de errores

## 📊 DynamoDB

### Tabla: tickets

- **Partition Key**: `id` (String)
- **Global Secondary Indexes**:
  - `StatusIndex`: Para consultas por estado (campo: `status`)

## 🎯 Principios SOLID Aplicados

- **Single Responsibility**: Cada clase tiene una única responsabilidad
- **Open-Closed**: Abierto a extensión, cerrado a modificación
- **Liskov Substitution**: Implementaciones intercambiables
- **Interface Segregation**: Interfaces específicas
- **Dependency Inversion**: Dependencias de abstracciones





