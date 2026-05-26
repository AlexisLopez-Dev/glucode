# Glucode — Simulador de glucosa didáctico

Aplicación web educativa orientada a personas recién diagnosticadas con diabetes tipo 1 y a su entorno familiar. Permite simular la evolución de la glucosa en sangre a partir de la ingesta de hidratos de carbono y la administración de insulina, representando los resultados mediante una curva glucémica interactiva generada por un motor de cálculo propio por fases.

**Aplicación en producción:** [glucode.vercel.app](https://glucode.vercel.app)

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React + Vite | 19.2.0 / 7.3.1 |
| Estilos | Tailwind CSS | 4.2.1 |
| Gráficas | Recharts | 3.8.0 |
| Formularios | React Hook Form | 7.71.2 |
| HTTP client | Axios | 1.13.6 |
| Backend | Laravel + PHP | 12.0 / 8.2 |
| Autenticación | Laravel Sanctum | 4.0 |
| OAuth 2.0 | Laravel Socialite | 5.27 |
| Base de datos | MySQL | — |

---

## Arquitectura

El sistema sigue una arquitectura **cliente-servidor desacoplada**. El frontend es una SPA que se comunica con el backend exclusivamente mediante una API REST stateless (JSON + Bearer token).

```
┌─────────────────────┐        API REST / JSON          ┌──────────────────────────┐
│   React SPA         │ ◄────────────────────────────►  │   Laravel API            │
│   (Vercel)          │        Bearer Token             │   (Plesk)                │
└─────────────────────┘                                 └──────────┬───────────────┘
                                                                   │
                                                              ┌────▼────┐
                                                              │  MySQL  │
                                                              └─────────┘
```

### Base de datos — modelo relacional

```
users ──── medical_settings (1:1)
      └─── simulations (1:N) ──── glucose_points (1:N)
```

Cada simulación almacena `ratio_snapshot` y `factor_snapshot` en el momento de su creación, garantizando la **inmutabilidad del historial** ante cambios posteriores del perfil médico.

---

## Características principales

- **Autenticación desacoplada** — registro por credenciales con verificación OTP por correo (adaptación de la verificación nativa de Laravel para no romper el estado de la SPA) y acceso alternativo mediante Google OAuth 2.0 (Socialite en modo `stateless()`).
- **Hard onboarding médico** — el simulador queda bloqueado hasta que el usuario configura su perfil (`carb_ratio`, `correction_start`, `correction_step`, `correction_units`), garantizando que el cálculo siempre tenga una base coherente.
- **Motor de simulación por fases** — ventana de 240 minutos en pasos de 5 minutos. El impacto de hidratos e insulina se distribuye en cuatro fases temporales con pesos distintos. Incluye `GLUCOSE_MODEL_MIN` para evitar valores negativos en el modelo interno y `GLUCOSE_SAFETY_FLOOR` (30 mg/dL) como suelo visual, más `CGM_NOISE_RANGE` para inyectar variabilidad realista en la curva mostrada.
- **Historial inmutable** — las simulaciones pasadas no se ven afectadas por modificaciones posteriores del perfil médico gracias a los campos snapshot.
- **CI/CD completo** — el frontend se redesploya automáticamente en Vercel y el backend en Plesk ante cada push a `main`.

---

## Estructura del proyecto

```
glucode/
├── backend/                  # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/ # AuthController, SimulationController,
│   │   │                     # SocialAuthController, MedicalSettingController
│   │   ├── Models/           # User, MedicalSetting, Simulation, GlucosePoint
│   │   └── Mail/             # VerificationCodeMail (OTP)
│   ├── config/cors.php       # CORS restringido a glucode.vercel.app
│   ├── database/migrations/
│   └── routes/api.php
└── frontend/                 # SPA React
    └── src/
        ├── components/
        │   ├── auth/         # RequireMedicalSettings (guard de ruta)
        │   ├── simulations/  # GlucoseChart, ParameterPanel, SimulationCard
        │   ├── forms/        # MadLibInput (formulario conversacional)
        │   ├── icons/        # Icons.jsx (sistema de iconos SVG interno)
        │   └── layout/       # MainLayout, Sidebar, Topbar
        ├── context/          # AuthContext + AuthProvider
        ├── pages/            # Login, Register, VerifyEmail, Settings,
        │                     # Dashboard, History, GoogleCallback
        └── routers/          # AppRouter (protección de rutas)
```

---

## Instalación en local

### Requisitos previos

- PHP 8.2+, Composer
- Node.js 20+, npm
- MySQL

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configura DB_*, MAIL_*, GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env
php artisan migrate
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
# Crea .env con VITE_API_URL=http://localhost:8000
npm run dev
```

---

## Despliegue

| Entorno | Plataforma | Trigger |
|---|---|---|
| Frontend | Vercel | Push a `main` (CI/CD automático) |
| Backend + MySQL | Plesk | Push a `main` (webhook → script post-update) |

El script de despliegue del backend ejecuta `composer install --no-dev --optimize-autoloader` y `php artisan optimize:clear`. CORS está configurado en `config/cors.php` para aceptar únicamente peticiones desde `https://glucode.vercel.app`.

---

## Control de versiones

El proyecto usa **GitFlow**: rama `main` para producción, `develop` como rama de integración y ramas `feature/*` para el desarrollo de cada funcionalidad. La metodología se adoptó a partir de la experiencia adquirida durante las prácticas en empresa (FCT) en la Universidad de Jaén.

---

## Autor

**Alexis López Moral** — Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)  
IES Fernando III · Curso 2025-2026
