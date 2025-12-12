# Frontend - Portal de Seguimiento de Incidencias

Frontend moderno construido con Next.js 14, TypeScript y Tailwind CSS siguiendo principios SOLID.

## 🏗️ Arquitectura

El frontend está organizado siguiendo principios de Clean Architecture:

```
frontend/
├── app/                     # App Router (Next.js 14)
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página principal
│
├── components/
│   ├── ui/                 # Componentes base reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Table.tsx
│   │   └── Tag.tsx
│   └── tickets/            # Componentes de dominio
│       ├── TicketForm.tsx
│       └── TicketList.tsx
│
├── services/
│   ├── api/                # Implementación de servicios
│   │   ├── apiClient.ts
│   │   └── ticketService.ts
│   └── interfaces/         # Interfaces (contratos)
│       └── ITicketService.ts
│
├── types/                  # Tipos TypeScript
│   └── ticket.ts
│
└── lib/                    # Utilidades
    └── config.ts
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20.x
- npm o yarn

### Instalación

```bash
npm install
```

### Configuración

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_KEY=your-api-key-here
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`

### Producción

```bash
npm run build
npm start
```

## 🎨 Características

- **Responsive Design**: Adaptable a todos los dispositivos
- **TypeScript**: Tipado estático completo
- **Tailwind CSS**: Estilos utility-first
- **Componentes Reutilizables**: UI components modulares
- **Manejo de Estados**: Loading, error, empty states
- **Validación**: Validación de formularios

## 📦 Componentes

### UI Components

Componentes base reutilizables:

- `Button`: Botón con variantes
- `Input`: Input con validación
- `Select`: Select con opciones
- `Table`: Tabla responsive
- `Tag`: Badge para estados

### Domain Components

Componentes específicos del dominio:

- `TicketForm`: Formulario de creación
- `TicketList`: Lista de tickets con filtros

## 🔌 Servicios

### ApiClient

Cliente HTTP genérico para peticiones a la API.

### TicketService

Servicio que implementa `ITicketService` para operaciones de tickets.

## 🎯 Principios SOLID Aplicados

- **Single Responsibility**: Cada componente tiene una única responsabilidad
- **Open-Closed**: Componentes extensibles mediante props
- **Liskov Substitution**: Componentes intercambiables
- **Interface Segregation**: Interfaces específicas
- **Dependency Inversion**: Servicios dependen de interfaces

## 📱 Pantallas

### Dashboard Principal

- Formulario de creación de tickets
- Lista de tickets con filtros
- Actualización de estado inline

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

### AWS Amplify

Conectar repositorio en AWS Amplify Console y configurar variables de entorno.





