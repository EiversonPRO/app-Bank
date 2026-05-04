# AppBank — Sistema de Banca Digital Personal

Proyecto full-stack de nivel junior/mid orientado al sector financiero, desarrollado con **Spring Boot 3.4**, **Angular 19** y **PostgreSQL**.

---

## Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| Autenticación | Registro e inicio de sesión con JWT |
| Dashboard | Balance total y movimientos recientes |
| Cuentas | Creación y gestión de cuentas de ahorros/corriente |
| Transferencias | Envío de dinero entre cuentas con validaciones |
| Historial | Paginación de transacciones por cuenta |
| Perfil | Consulta y edición de datos personales |

---

## Stack tecnológico

**Backend**
- Java 21 + Spring Boot 3.4
- Spring Security 6 + JWT (jjwt 0.12)
- Spring Data JPA + Hibernate
- Bean Validation (Jakarta)
- PostgreSQL 16

**Frontend**
- Angular 19 (standalone components)
- Angular Material 19
- RxJS 7
- SCSS

---

## Seguridad implementada

- Contraseñas hasheadas con BCrypt (cost factor 12)
- Tokens JWT firmados con HMAC-SHA256
- Sesiones stateless (sin estado en servidor)
- CORS restringido al origen del frontend
- Validación de inputs en backend y frontend
- Protección contra SQL injection via JPA
- Secretos manejados por variables de entorno
- Guard de rutas en Angular
- Interceptor que maneja 401 y limpia sesión

---

## Requisitos previos

- Java 21+
- Node.js 20+
- Docker y Docker Compose (para base de datos)
- Maven 3.9+

---

## Inicio rápido

### 1. Levantar la base de datos

```bash
docker-compose up postgres -d
```

### 2. Ejecutar el backend

```bash
cd backend
mvn spring-boot:run
```

El servidor arranca en `http://localhost:8080`

### 3. Ejecutar el frontend

```bash
cd frontend
npm install
ng serve
```

La aplicación abre en `http://localhost:4200`

---

## Variables de entorno del backend

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_URL` | URL JDBC de PostgreSQL | `jdbc:postgresql://localhost:5432/appbank` |
| `DB_USERNAME` | Usuario de la base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña de la base de datos | `postgres` |
| `JWT_SECRET` | Secreto Base64 para firma JWT (≥32 bytes) | Valor de desarrollo |

> **Importante:** En producción, reemplaza siempre `JWT_SECRET` con un secreto fuerte generado aleatoriamente.

---

## Estructura del proyecto

```
app-bank/
├── backend/                  # Spring Boot API REST
│   ├── src/main/java/com/appbank/
│   │   ├── config/           # SecurityConfig, CorsConfig, ApplicationConfig
│   │   ├── controller/       # AuthController, AccountController, etc.
│   │   ├── dto/              # Request y Response DTOs
│   │   ├── entity/           # User, Account, Transaction + enums
│   │   ├── exception/        # AppException + GlobalExceptionHandler
│   │   ├── repository/       # Repositorios JPA
│   │   ├── security/         # JWT, filtros, UserDetails
│   │   └── service/          # Lógica de negocio
│   └── pom.xml
│
├── frontend/                 # Angular 19 SPA
│   └── src/app/
│       ├── core/             # Modelos, servicios, guards, interceptors
│       ├── features/         # auth, dashboard, accounts, transfers, profile
│       └── shared/           # layout (sidebar, navbar)
│
└── docker-compose.yml
```

---

## API Endpoints

### Autenticación (público)
```
POST /api/auth/register
POST /api/auth/login
```

### Cuentas (requiere JWT)
```
GET    /api/accounts
POST   /api/accounts
GET    /api/accounts/{id}
```

### Transacciones (requiere JWT)
```
POST   /api/transactions/transfer
GET    /api/transactions/account/{accountId}?page=0&size=10
GET    /api/transactions/recent
```

### Usuarios (requiere JWT)
```
GET    /api/users/me
PATCH  /api/users/me
```
