# 🚀 Guía de Despliegue Paso a Paso

Esta guía te llevará paso a paso para desplegar el Portal de Seguimiento de Incidencias en AWS.

## 📋 Prerrequisitos

1. **Cuenta de AWS** con permisos para:
   - Lambda
   - API Gateway
   - DynamoDB
   - CloudFormation
   - IAM

2. **AWS CLI instalado y configurado**
   ```bash
   aws configure
   ```

3. **AWS SAM CLI instalado**
   - Windows: `choco install aws-sam-cli`
   - macOS: `brew install aws-sam-cli`
   - Linux: Ver [documentación oficial](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

4. **Node.js 20.x** instalado

## 🔧 Paso 1: Configurar Backend

### 1.1 Instalar Dependencias

```bash
cd backend
npm install
```

### 1.2 Construir la Aplicación

```bash
sam build
```

Esto compilará el código TypeScript y preparará los artefactos para el despliegue.

## ☁️ Paso 2: Desplegar Backend a AWS

### 2.1 Despliegue Guiado (Primera Vez)

```bash
sam deploy --guided
```

Se te pedirán los siguientes valores:

- **Stack Name**: `tickets-backend` (o el que prefieras)
- **AWS Region**: `us-east-1` (o tu región preferida)
- **Parameter ApiKey**: Dejar vacío (se generará automáticamente)
- **Confirm changes before deploy**: `Y`
- **Allow SAM CLI IAM role creation**: `Y` (necesario para crear roles IAM)
- **Disable rollback**: `N`
- **Save arguments to configuration file**: `Y` (guardará en `samconfig.toml`)

### 2.2 Esperar el Despliegue

El despliegue puede tardar 5-10 minutos. SAM creará:
- Tabla DynamoDB
- 3 funciones Lambda
- API Gateway
- API Key
- Usage Plan
- Roles IAM necesarios

### 2.3 Obtener Outputs

Al finalizar el despliegue, verás los outputs:

```
Outputs:
ApiUrl: https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
ApiKey: xxxxx-xxxxx-xxxxx
TicketsTableName: tickets
```

**⚠️ IMPORTANTE**: Guarda estos valores, los necesitarás para el frontend.

### 2.4 Obtener API Key (si no la copiaste)

El API Key ID se muestra en los outputs del despliegue. Para obtener el valor:

```bash
aws apigateway get-api-key --api-key <ApiKeyId> --include-value --query value --output text
```

Reemplaza `<ApiKeyId>` con el valor del output `ApiKeyId` del despliegue.

O desde la consola de AWS:
1. Ir a API Gateway Console
2. Seleccionar "API Keys" en el menú lateral
3. Buscar la key con nombre `TicketsApiKey-{stack-name}`
4. Click en la key y luego en "Show" para ver el valor

## 🎨 Paso 3: Configurar Frontend

### 3.1 Instalar Dependencias

```bash
cd ../frontend
npm install
```

### 3.2 Configurar Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_API_KEY=xxxxx-xxxxx-xxxxx
```

Reemplaza los valores con los obtenidos en el paso 2.3.

### 3.3 Probar Localmente (Opcional)

```bash
npm run dev
```

Abre `http://localhost:3001` y verifica que funcione correctamente.

## 🌐 Paso 4: Desplegar Frontend

### Opción A: Vercel (Recomendado)

#### 4.1 Instalar Vercel CLI

```bash
npm i -g vercel
```

#### 4.2 Desplegar

```bash
vercel
```

Sigue las instrucciones:
- ¿Set up and deploy? `Y`
- ¿Which scope? Selecciona tu cuenta
- ¿Link to existing project? `N`
- ¿Project name? `tickets-frontend` (o el que prefieras)
- ¿Directory? `./`
- ¿Override settings? `N`

#### 4.3 Configurar Variables de Entorno

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a "Settings" > "Environment Variables"
4. Agrega:
   - `NEXT_PUBLIC_API_URL`: URL de tu API Gateway
   - `NEXT_PUBLIC_API_KEY`: Tu API Key

#### 4.4 Redeploy

Vercel redeployará automáticamente con las nuevas variables.

### Opción B: AWS Amplify

#### 4.1 Conectar Repositorio

1. Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click en "New app" > "Host web app"
3. Conecta tu repositorio (GitHub, GitLab, etc.)
4. Selecciona la rama principal

#### 4.2 Configurar Build

Amplify detectará automáticamente Next.js. Verifica la configuración:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### 4.3 Configurar Variables de Entorno

En la configuración del build, agrega:

- `NEXT_PUBLIC_API_URL`: URL de tu API Gateway
- `NEXT_PUBLIC_API_KEY`: Tu API Key

#### 4.4 Desplegar

Click en "Save and deploy". Amplify construirá y desplegará automáticamente.

## ✅ Paso 5: Verificar Despliegue

### 5.1 Verificar Backend

Usa Postman o curl para probar los endpoints:

```bash
curl -X GET "https://your-api-url/tickets" \
  -H "x-api-key: your-api-key"
```

### 5.2 Verificar Frontend

Abre la URL de tu frontend desplegado y:
1. Verifica que cargue correctamente
2. Intenta crear un ticket
3. Verifica que se listen los tickets
4. Prueba cambiar el estado de un ticket

## 🔍 Paso 6: Monitoreo y Troubleshooting

### Ver Logs de Lambda

```bash
# Ver logs de una función específica
sam logs -n CreateTicketFunction --stack-name tickets-backend --tail

# Ver logs de todas las funciones
sam logs --stack-name tickets-backend --tail
```

### Ver Logs en CloudWatch

1. Ve a AWS Console > CloudWatch
2. Selecciona "Log groups"
3. Busca `/aws/lambda/tickets-backend-*`

### Verificar API Gateway

1. Ve a API Gateway Console
2. Selecciona tu API
3. Ve a "Stages" > "prod"
4. Verifica los endpoints y configuración

### Verificar DynamoDB

1. Ve a DynamoDB Console
2. Selecciona la tabla "tickets"
3. Verifica los items creados

## 🗑️ Paso 7: Eliminar Recursos (si es necesario)

### Eliminar Stack Completo

```bash
cd backend
aws cloudformation delete-stack --stack-name tickets-backend
```

**⚠️ ADVERTENCIA**: Esto eliminará todos los recursos, incluyendo la tabla DynamoDB y sus datos.

### Eliminar Frontend

- **Vercel**: Dashboard > Settings > Delete Project
- **Amplify**: Console > App Settings > Delete App

## 📊 Costos Estimados

Con uso bajo a moderado:

- **Lambda**: Gratis (1M requests/mes gratis)
- **API Gateway**: Gratis (1M requests/mes gratis)
- **DynamoDB**: Gratis (25GB storage, 25 RCU/WCU gratis)
- **Vercel**: Gratis (hobby plan)
- **Amplify**: Gratis (5GB bandwidth/mes gratis)

**Total estimado**: $0-5/mes para uso bajo

## 🎯 Checklist Final

- [ ] Backend desplegado en AWS
- [ ] API Gateway funcionando
- [ ] DynamoDB tabla creada
- [ ] API Key configurada
- [ ] Frontend desplegado
- [ ] Variables de entorno configuradas
- [ ] Endpoints funcionando
- [ ] UI responsive y funcional
- [ ] Postman collection importada y probada

## 🆘 Solución de Problemas Comunes

### Error: "Access Denied"
- Verifica permisos IAM de tu usuario AWS
- Asegúrate de tener permisos para CloudFormation, Lambda, API Gateway, DynamoDB

### Error: "API Key not found"
- Verifica que el API Key esté asociado al Usage Plan
- Verifica que el header `x-api-key` (lowercase) esté presente en las peticiones
- API Gateway requiere el header en minúsculas

### Error: "Table not found"
- Verifica que la tabla DynamoDB se haya creado
- Verifica el nombre de la tabla en las variables de entorno

### Frontend no se conecta al backend
- Verifica `NEXT_PUBLIC_API_URL` en variables de entorno
- Verifica CORS en API Gateway
- Verifica que el API Key sea correcto

---

**¡Despliegue completado!** 🎉





