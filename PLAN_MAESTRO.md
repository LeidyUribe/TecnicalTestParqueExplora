# 🏗️ PLAN MAESTRO - Portal de Seguimiento de Incidencias

## 📋 ÍNDICE
1. [Arquitectura General](#1-arquitectura-general)
2. [Estructura del Backend (SAM)](#2-estructura-del-backend-sam)
3. [Estructura del Frontend (Next.js)](#3-estructura-del-frontend-nextjs)
4. [Buenas Prácticas](#4-buenas-prácticas)
5. [Paso a Paso del Desarrollo](#5-paso-a-paso-del-desarrollo)
6. [Entregables](#6-entregables)

---

## 1. ARQUITECTURA GENERAL

### 1.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js 14 (App Router)                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │  Pages   │  │ Services │  │ Components│          │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘          │   │
│  │       │             │             │                 │   │
│  │       └─────────────┴─────────────┘                 │   │
│  │                    │                                 │   │
│  └────────────────────┼─────────────────────────────────┘   │
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
│  │         │                                             │   │
│  │         ▼                                             │   │
│  └─────────┼─────────────────────────────────────────────┘   │
│            │                                                  │
└────────────┼──────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              DynamoDB                                  │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │  Table: tickets                               │    │   │
│  │  │  PK: id (String)                              │    │   │
│  │  │  GSI: status-index (status)                   │    │   │
│  │  │  GSI: created-index (createdAt)               │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Separación de Capas (Clean Architecture)

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

### 1.3 Principios SOLID Aplicados

**Backend:**
- **S (Single Responsibility)**: Cada clase tiene una única responsabilidad
  - `TicketRepository`: Solo acceso a datos
  - `CreateTicketUseCase`: Solo lógica de creación
  - `TicketHandler`: Solo manejo HTTP

- **O (Open-Closed)**: Abierto a extensión, cerrado a modificación
  - Interfaces de repositorio permiten cambiar implementación
  - Use cases extensibles sin modificar código existente

- **L (Liskov Substitution)**: Implementaciones intercambiables
  - Cualquier implementación de `ITicketRepository` funciona igual

- **I (Interface Segregation)**: Interfaces específicas
  - `ITicketRepository` solo métodos necesarios para tickets

- **D (Dependency Inversion)**: Depender de abstracciones
  - Use cases dependen de interfaces, no de implementaciones concretas

**Frontend:**
- **S**: Componentes con responsabilidad única
- **O**: Componentes base extensibles
- **L**: Componentes intercambiables
- **I**: Hooks y servicios específicos
- **D**: Servicios dependen de interfaces, no de implementaciones

---

## 2. ESTRUCTURA DEL BACKEND (SAM)

### 2.1 Creación del Proyecto SAM

**Paso 1.1**: Inicializar proyecto SAM
```bash
sam init --name ticket-tracking-backend \
  --runtime nodejs20.x \
  --template hello-world \
  --app-template hello-world \
  --package-type Zip
```

**Paso 1.2**: Estructura de carpetas resultante
```
backend/
├── template.yaml           # SAM template
├── samconfig.toml          # Configuración SAM
├── .gitignore
├── package.json
└── src/
    └── [estructura Clean Architecture]
```

### 2.2 Organización con Clean Architecture

**Paso 2.1**: Crear estructura de carpetas
```
src/
├── domain/
│   ├── entities/
│   │   └── Ticket.ts
│   ├── value-objects/
│   │   ├── TicketStatus.ts
│   │   └── TicketPriority.ts
│   └── repositories/
│       └── ITicketRepository.ts
│
├── application/
│   ├── use-cases/
│   │   ├── CreateTicketUseCase.ts
│   │   ├── GetTicketsUseCase.ts
│   │   └── UpdateTicketStatusUseCase.ts
│   ├── dtos/
│   │   ├── CreateTicketDTO.ts
│   │   ├── TicketResponseDTO.ts
│   │   └── UpdateStatusDTO.ts
│   └── services/
│       └── TicketService.ts
│
├── infrastructure/
│   ├── persistence/
│   │   ├── DynamoTicketRepository.ts
│   │   └── DynamoDBClient.ts
│   ├── http/
│   │   ├── handlers/
│   │   │   ├── createTicketHandler.ts
│   │   │   ├── getTicketsHandler.ts
│   │   │   └── updateTicketStatusHandler.ts
│   │   └── responses/
│   │       └── ApiResponse.ts
│   └── config/
│       └── environment.ts
│
└── shared/
    ├── errors/
    │   ├── DomainError.ts
    │   ├── ValidationError.ts
    │   └── NotFoundError.ts
    └── utils/
        └── uuid.ts
```

### 2.3 Modelos y DTOs (SOLID)

**Paso 3.1**: Entidad de Dominio (Domain Layer)
```typescript
// domain/entities/Ticket.ts
export class Ticket {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: TicketStatus,
    public readonly priority: TicketPriority,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly createdBy?: string
  ) {}

  // Métodos de dominio
  canTransitionTo(newStatus: TicketStatus): boolean {
    // Lógica de negocio para transiciones válidas
  }
}
```

**Paso 3.2**: Value Objects
```typescript
// domain/value-objects/TicketStatus.ts
export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}
```

**Paso 3.3**: DTOs (Application Layer)
```typescript
// application/dtos/CreateTicketDTO.ts
export interface CreateTicketDTO {
  title: string;
  description: string;
  priority?: TicketPriority;
  createdBy?: string;
}

// application/dtos/TicketResponseDTO.ts
export interface TicketResponseDTO {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2.4 Services y Repositories (SOLID)

**Paso 4.1**: Interface del Repositorio (Dependency Inversion)
```typescript
// domain/repositories/ITicketRepository.ts
export interface ITicketRepository {
  create(ticket: Ticket): Promise<Ticket>;
  findById(id: string): Promise<Ticket | null>;
  findByStatus(status: TicketStatus): Promise<Ticket[]>;
  updateStatus(id: string, status: TicketStatus): Promise<Ticket>;
}
```

**Paso 4.2**: Implementación del Repositorio
```typescript
// infrastructure/persistence/DynamoTicketRepository.ts
export class DynamoTicketRepository implements ITicketRepository {
  constructor(private dynamoClient: DynamoDBClient) {}
  
  async create(ticket: Ticket): Promise<Ticket> {
    // Implementación específica de DynamoDB
  }
  
  // ... otros métodos
}
```

**Paso 4.3**: Use Cases (Single Responsibility)
```typescript
// application/use-cases/CreateTicketUseCase.ts
export class CreateTicketUseCase {
  constructor(private repository: ITicketRepository) {}
  
  async execute(dto: CreateTicketDTO): Promise<TicketResponseDTO> {
    // 1. Validar DTO
    // 2. Crear entidad Ticket
    // 3. Persistir
    // 4. Retornar DTO
  }
}
```

### 2.5 Handlers Lambda Desacoplados

**Paso 5.1**: Handler Genérico
```typescript
// infrastructure/http/handlers/createTicketHandler.ts
export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    // 1. Parsear request
    // 2. Validar API Key
    // 3. Inyectar dependencias
    // 4. Ejecutar use case
    // 5. Retornar respuesta
  } catch (error) {
    // Manejo de errores
  }
};
```

### 2.6 Template SAM (template.yaml)

**Paso 6.1**: Definición de recursos
- API Gateway
- Lambda Functions (3)
- DynamoDB Table
- API Key
- Usage Plan
- IAM Roles

**Paso 6.2**: Configuración de API Key
- Crear API Key resource
- Asociar a Usage Plan
- Configurar en API Gateway

### 2.7 Tabla DynamoDB

**Paso 7.1**: Diseño de tabla
- Partition Key: `id` (String)
- Global Secondary Index: `status-index` (status)
- Global Secondary Index: `created-index` (createdAt)

### 2.8 Endpoints

**POST /tickets**
- Body: `{ title, description, priority?, createdBy? }`
- Response: `201 Created` con ticket creado

**GET /tickets?status=OPEN**
- Query params: `status` (opcional)
- Response: `200 OK` con array de tickets

**PATCH /tickets/{id}/status**
- Path param: `id`
- Body: `{ status }`
- Response: `200 OK` con ticket actualizado

---

## 3. ESTRUCTURA DEL FRONTEND (Next.js)

### 3.1 Arquitectura de Carpetas

```
frontend/
├── app/                     # App Router (Next.js 14)
│   ├── layout.tsx
│   ├── page.tsx            # Dashboard/Lista
│   ├── tickets/
│   │   ├── new/
│   │   │   └── page.tsx    # Crear ticket
│   │   └── [id]/
│   │       └── page.tsx    # Detalle ticket
│   └── api/                # API Routes (si necesario)
│
├── components/
│   ├── ui/                 # Componentes base
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Table.tsx
│   │   └── Tag.tsx
│   ├── tickets/
│   │   ├── TicketForm.tsx
│   │   ├── TicketList.tsx
│   │   └── TicketCard.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── services/
│   ├── api/
│   │   ├── ticketService.ts
│   │   └── apiClient.ts
│   └── interfaces/
│       └── ITicketService.ts
│
├── hooks/
│   ├── useTickets.ts
│   └── useCreateTicket.ts
│
├── types/
│   └── ticket.ts
│
└── lib/
    └── utils.ts
```

### 3.2 Servicios (Dependency Inversion)

**Paso 3.2.1**: Interface del Servicio
```typescript
// services/interfaces/ITicketService.ts
export interface ITicketService {
  createTicket(data: CreateTicketRequest): Promise<Ticket>;
  getTickets(filters?: TicketFilters): Promise<Ticket[]>;
  updateTicketStatus(id: string, status: string): Promise<Ticket>;
}
```

**Paso 3.2.2**: Implementación
```typescript
// services/api/ticketService.ts
export class TicketService implements ITicketService {
  constructor(private apiClient: ApiClient) {}
  
  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    return this.apiClient.post('/tickets', data);
  }
  
  // ... otros métodos
}
```

### 3.3 Componentes Reutilizables

**Paso 3.3.1**: Componentes UI Base
- `Button`: Botón reutilizable con variantes
- `Input`: Input con validación
- `Select`: Select con opciones
- `Table`: Tabla con paginación
- `Tag`: Badge para estados

**Paso 3.3.2**: Componentes de Dominio
- `TicketForm`: Formulario de creación
- `TicketList`: Lista de tickets
- `TicketCard`: Tarjeta individual

### 3.4 Manejo de Estados

**Paso 3.4.1**: Server Components
- `app/page.tsx`: Lista inicial (Server Component)
- Fetch inicial en servidor

**Paso 3.4.2**: Client Components
- Formularios (interactivos)
- Lista con filtros dinámicos
- Actualización de estado

**Paso 3.4.3**: Estados UI
- Loading states
- Error states
- Empty states

### 3.5 Pantallas

**Pantalla 1: Crear Ticket**
- Formulario con validación
- Estados: idle, submitting, success, error

**Pantalla 2: Listar Tickets**
- Filtro por estado
- Tabla responsive
- Paginación (opcional)

**Pantalla 3: Actualizar Estado**
- Modal o página
- Select de estados
- Confirmación

---

## 4. BUENAS PRÁCTICAS

### 4.1 SOLID en Lambdas

**Single Responsibility**
- Cada handler tiene una única responsabilidad
- Cada use case resuelve un solo caso de uso

**Dependency Inversion**
- Handlers dependen de interfaces, no implementaciones
- Inyección de dependencias manual o con contenedor

**Ejemplo:**
```typescript
// Handler desacoplado
export const handler = async (event: APIGatewayProxyEvent) => {
  const repository = new DynamoTicketRepository(dynamoClient);
  const useCase = new CreateTicketUseCase(repository);
  // ...
};
```

### 4.2 Inyección de Dependencias

**Opción 1: Manual (Simple)**
```typescript
const repository = new DynamoTicketRepository(dynamoClient);
const useCase = new CreateTicketUseCase(repository);
```

**Opción 2: Container (Avanzado)**
```typescript
// Usar biblioteca como tsyringe o inversify
container.register<ITicketRepository>('TicketRepository', DynamoTicketRepository);
```

### 4.3 Clean Architecture

**Reglas:**
- Domain no depende de nada
- Application depende solo de Domain
- Infrastructure depende de Application y Domain
- Handlers dependen de Application

**Flujo de dependencias:**
```
Handler → UseCase → Repository Interface
                      ↑
            Repository Implementation
```

### 4.4 Next.js 14 Buenas Prácticas

**Server Components por defecto**
- Usar Server Components cuando sea posible
- Client Components solo para interactividad

**Server Actions (opcional)**
- Para mutaciones desde Server Components

**Caching**
- `fetch` con `cache: 'no-store'` para datos dinámicos
- Revalidación cuando sea necesario

**TypeScript**
- Tipos estrictos en toda la aplicación
- Interfaces para contratos

---

## 5. PASO A PASO DEL DESARROLLO

### FASE 1: SETUP INICIAL

**Paso 1**: Crear repositorio
```bash
git init
git remote add origin <url>
```

**Paso 2**: Crear estructura de carpetas
```bash
mkdir -p backend frontend
```

### FASE 2: BACKEND

**Paso 3**: Inicializar proyecto SAM
```bash
cd backend
sam init --runtime nodejs20.x --template hello-world
```

**Paso 4**: Configurar SAM
- Editar `template.yaml`
- Configurar `samconfig.toml`

**Paso 5**: Crear estructura Clean Architecture
```bash
mkdir -p src/{domain/{entities,value-objects,repositories},application/{use-cases,dtos,services},infrastructure/{persistence,http/{handlers,responses},config},shared/{errors,utils}}
```

**Paso 6**: Implementar Domain Layer
- Entidad Ticket
- Value Objects (Status, Priority)
- Interface ITicketRepository

**Paso 7**: Implementar Application Layer
- DTOs
- Use Cases (Create, Get, UpdateStatus)

**Paso 8**: Implementar Infrastructure Layer
- DynamoTicketRepository
- Handlers Lambda
- Configuración

**Paso 9**: Configurar template.yaml
- Definir API Gateway
- Definir Lambdas
- Definir DynamoDB
- Configurar API Key

**Paso 10**: Probar con SAM Local
```bash
sam build
sam local start-api
```

### FASE 3: FRONTEND

**Paso 11**: Crear proyecto Next.js
```bash
cd ../frontend
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

**Paso 12**: Crear estructura de carpetas
- components/
- services/
- hooks/
- types/

**Paso 13**: Implementar servicios API
- ApiClient
- TicketService
- Interfaces

**Paso 14**: Crear componentes UI
- Button, Input, Select, Table, Tag

**Paso 15**: Crear componentes de dominio
- TicketForm, TicketList, TicketCard

**Paso 16**: Implementar pantallas
- Crear ticket
- Listar tickets
- Actualizar estado

**Paso 17**: Integrar APIs
- Conectar servicios con componentes
- Manejar estados (loading, error)

**Paso 18**: Pruebas locales
```bash
npm run dev
```

### FASE 4: DESPLIEGUE

**Paso 19**: Deploy Backend a AWS
```bash
cd backend
sam build
sam deploy --guided
```

**Paso 20**: Configurar variables de entorno frontend
- API Gateway URL
- API Key

**Paso 21**: Deploy Frontend
- Vercel (recomendado)
- O AWS Amplify

### FASE 5: DOCUMENTACIÓN

**Paso 22**: Crear README.md
- Descripción del proyecto
- Instrucciones de instalación
- Instrucciones de despliegue

**Paso 23**: Crear Postman Collection
- Endpoints documentados
- Ejemplos de requests

**Paso 24**: Crear diagrama de arquitectura
- Diagrama visual o textual

---

## 6. ENTREGABLES

### 6.1 README.md Profesional

Debe incluir:
- Descripción del proyecto
- Arquitectura (diagrama)
- Tecnologías utilizadas
- Requisitos previos
- Instalación local
- Configuración
- Ejecución local
- Despliegue a AWS
- Estructura del proyecto
- API Documentation
- Contribución

### 6.2 Postman Collection

Incluir:
- Variables de entorno (API URL, API Key)
- Requests para cada endpoint
- Ejemplos de body
- Tests automáticos (opcional)

### 6.3 Diagrama de Arquitectura

Formato:
- Textual (ASCII art)
- O visual (Mermaid, PlantUML)
- Incluir en README

---

## ✅ CHECKLIST FINAL

- [ ] Backend con Clean Architecture
- [ ] Principios SOLID aplicados
- [ ] 3 Endpoints funcionando
- [ ] API Key configurada
- [ ] DynamoDB con índices
- [ ] Frontend Next.js funcional
- [ ] UI responsive
- [ ] Manejo de errores
- [ ] Validaciones
- [ ] TypeScript en todo el proyecto
- [ ] README completo
- [ ] Postman Collection
- [ ] Desplegado en AWS
- [ ] Documentación técnica

---

**Fin del Plan Maestro**





