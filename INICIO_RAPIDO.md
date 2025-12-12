# ⚡ Inicio Rápido

Guía rápida para poner en marcha el proyecto en 5 minutos.

## 🚀 Backend (SAM Local)

```bash
cd backend
npm install
sam build
sam local start-api
```

Backend disponible en: `http://localhost:3000`

## 🎨 Frontend

```bash
cd frontend
npm install

# Crear .env.local con:
# NEXT_PUBLIC_API_URL=http://localhost:3000
# NEXT_PUBLIC_API_KEY=test-key
#
# Nota: Para desarrollo local con SAM, el API Key puede ser cualquier valor
# ya que SAM Local no valida el API Key por defecto

npm run dev
```

Frontend disponible en: `http://localhost:3001`

## ☁️ Despliegue a AWS

### Backend

```bash
cd backend
sam build
sam deploy --guided
```

### Frontend

**Vercel:**
```bash
cd frontend
npm i -g vercel
vercel
```

**O AWS Amplify:**
- Conectar repositorio en AWS Amplify Console
- Configurar variables de entorno

## 📚 Documentación Completa

- [README.md](README.md) - Documentación principal
- [PLAN_MAESTRO.md](PLAN_MAESTRO.md) - Plan detallado del proyecto
- [GUIA_DESPLIEGUE.md](GUIA_DESPLIEGUE.md) - Guía completa de despliegue
- [Tickets_API.postman_collection.json](Tickets_API.postman_collection.json) - Colección Postman

## ✅ Checklist

- [x] Backend funcionando localmente
- [x] Frontend funcionando localmente
- [x] Backend desplegado en AWS
- [ ] Frontend desplegado
- [ ] Variables de entorno configuradas
- [ ] Postman collection importada

---

**¡Listo para empezar!** 🎉





