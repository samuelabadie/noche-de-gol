# 🏆 Torneo de Fútbol Local

Aplicación web para gestionar un torneo de fútbol local en un pueblo español. Permite la inscripción de equipos y la gestión completa del torneo.

## 🚀 Características

### Página Pública (`/`)
- **Inscripción de equipos**: Formulario dinámico para registrar equipos
- **Validaciones**: Máximo 10 equipos, mínimo 6 personas por equipo (5 jugadores + 1 entrenador), máximo 10 personas
- **Interfaz en español**: Todos los textos y mensajes en español
- **Diseño responsive**: Funciona en móviles y ordenadores

### Panel de Administración (`/admin`)
- **Acceso protegido**: Contraseña configurable en variables de entorno
- **Gestión de equipos**: Ver todos los equipos inscritos y sus jugadores
- **Eliminación de equipos**: Eliminar equipos (solo si no tienen partidos programados)
- **Creación de partidos**: Seleccionar dos equipos para crear un partido
- **Registro de resultados**: Introducir scores y marcar partidos como terminados
- **Clasificación automática**: Tabla de posiciones actualizada automáticamente
- **Estadísticas**: Resumen de equipos, partidos y estado del torneo

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Base de datos**: SQLite con Prisma ORM
- **UI**: Tailwind CSS + shadcn/ui
- **Autenticación**: Contraseña simple (configurable)
- **Idioma**: Español completo

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd torneo-futbol-local
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="tu-contraseña-segura"
```

4. **Configurar la base de datos**
```bash
npx prisma generate
npx prisma db push
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📊 Estructura de la Base de Datos

### Modelo Equipe
- `id`: Identificador único
- `nom`: Nombre del equipo
- `dateInscription`: Fecha de inscripción
- `joueurs`: Relación con los jugadores

### Modelo Joueur
- `id`: Identificador único
- `nom`: Nombre del jugador
- `poste`: Posición (opcional)
- `estCoach`: Si es entrenador
- `equipeId`: Referencia al equipo

### Modelo Match
- `id`: Identificador único
- `equipe1Id`: Primer equipo
- `equipe2Id`: Segundo equipo
- `scoreEquipe1`: Goles del equipo 1
- `scoreEquipe2`: Goles del equipo 2
- `date`: Fecha del partido
- `termine`: Si el partido ha terminado

## 🎯 Funcionalidades Principales

### Inscripción de Equipos
- Formulario dinámico que permite añadir entre 6 y 10 personas
- Validación automática: exactamente 1 entrenador y mínimo 5 jugadores por equipo
- Límite de 10 equipos máximo
- Mensajes de confirmación en español

### Gestión de Partidos
- Crear partidos seleccionando dos equipos
- Registrar resultados con scores
- Marcar partidos como terminados
- Vista de todos los partidos con estado

### Clasificación
- Cálculo automático de puntos (3 por victoria, 1 por empate)
- Ordenación por puntos, diferencia de goles y goles a favor
- Actualización en tiempo real

## 🔧 Configuración

### Variables de Entorno
- `DATABASE_URL`: URL de la base de datos SQLite
- `ADMIN_PASSWORD`: Contraseña para acceder al panel de administración

### Personalización
- Cambiar colores: Modificar variables CSS en `globals.css`
- Añadir campos: Modificar el schema de Prisma y los formularios
- Cambiar idioma: Modificar textos en los componentes

## 📱 Uso

### Para los Equipos
1. Acceder a la página principal (`/`)
2. Completar el formulario de inscripción
3. Añadir jugadores y marcar uno como entrenador
4. Enviar el formulario

### Para los Administradores
1. Acceder a `/admin`
2. Introducir la contraseña configurada
3. Gestionar equipos, crear partidos y registrar resultados
4. Ver la clasificación actualizada

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar el repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Otros Proveedores
- Asegurar que soporten SQLite
- Configurar variables de entorno
- Ejecutar migraciones de base de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

Para dudas o problemas:
- Crear un issue en GitHub
- Contactar al desarrollador

---

**¡Disfruta organizando tu torneo de fútbol local! ⚽🏆**
