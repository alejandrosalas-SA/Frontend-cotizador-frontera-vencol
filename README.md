# Cotizador de Póliza de Transportistas Binacionales

<div align="center">
  <img src="./src/assets/Logos-Seguros-Altamira/icono-cotizador.png" alt="Logo de Seguros Altamira" width="200">
</div>

<div align="center">
  <h3>Seguros Altamira - Responsabilidad Civil para el Transportador por Carretera en Viaje Internacional</h3>
</div>

<br/>

La aplicación **Cotizador de Póliza de Transportistas Binacionales** es una herramienta web dinámica diseñada específicamente para el uso interno de los empleados (emisores y asesores) de **Seguros Altamira**. Su objetivo principal es automatizar y facilitar la creación de solicitudes y la cotización de pólizas de seguros para el transporte de carga en rutas internacionales (fundamentalmente entre la República de Colombia y la República Bolivariana de Venezuela).

A través de esta plataforma, el empleado puede gestionar de manera eficiente todo el flujo de cotización, desde la captura de los datos del solicitante y del vehículo, hasta el cálculo de cuotas y coberturas, agilizando la emisión de pólizas internacionales.

Para más información sobre las características de este producto, visita el sitio web oficial: [Responsabilidad Civil General (RCG) para Transportistas Binacionales](https://www.segurosaltamira.com/productos/responsabilidada-civil-general-rcg-para-transportistas-binacionales/).

---


<div align="center">
  <video width="100%" controls autoplay loop muted>
    <source src="./src/assets/Animación_de_Camión_en_Vía.mp4" type="video/mp4">
    Tu navegador no soporta la etiqueta de video.
  </video>
</div>

*(Nota: En plataformas que no rendericen la etiqueta de video, puedes encontrar el archivo multimedia en la ruta `src/assets/Animación_de_Camión_en_Vía.mp4`)*

---

## 🧩 Módulos Actuales

El sistema está estructurado mediante un asistente (wizard) intuitivo y diversas capas de administración que incluyen los siguientes módulos principales:

- **Dashboard:** Panel de inicio rápido para acceder a nuevas cotizaciones, ver el flujo de trabajo y visualizar un resumen del estado del usuario logueado.
- **Cotizador (Wizard de Solicitudes):** 
  - **Datos del Solicitante:** Toma de información del cliente, clasificación de persona, asociación del corredor/intermediario y asignación de sucursal.
  - **Datos del Vehículo:** Captura estructurada de marca, modelo, año, placa, número de puestos, tipo de exceso y tasaciones especiales.
  - **Cuotas y Coberturas:** Tabulador automático que calcula primas basado en duraciones de viaje y coberturas opcionales. Emite la cotización final o permite guardarla en estado de *Borrador*.
- **Mis Solicitudes:** Listado tipo tabla de datos interactiva, donde se pueden buscar, filtrar (por estado, fechas, datos del cliente/vehículo), visualizar y eliminar las cotizaciones y borradores generados por el emisor.

---

## 🚀 Próximamente (Roadmap)

La plataforma se encuentra en continuo desarrollo para potenciar el análisis y la administración de la información. Próximamente se integrarán las siguientes funcionalidades:

- **Módulo de Gestión de Sumas Aseguradas:** Interfaz administrativa para la parametrización dinámica de límites y valores asegurados.
- **Módulo de Gestión de Pólizas Aseguradas:** Panel para la administración del ciclo de vida de las pólizas emitidas (renovaciones, estatus, siniestros).
- **Dashboard de Información de Interés:** Un nuevo panel analítico avanzado que proveerá métricas clave, estadísticas y resúmenes de alto valor sobre el estado de esta póliza puntual para la toma de decisiones.

---

## 💻 Stack Tecnológico

Este proyecto ha sido construido utilizando un conjunto de tecnologías de alto rendimiento que garantizan escalabilidad y una excelente experiencia de usuario:

**Ecosistema del Frontend:**
- **React 19:** Librería fundamental para orquestar las interfaces de usuario.
- **TypeScript:** Sistema de tipado estricto para un entorno de desarrollo seguro.
- **Vite:** Entorno de desarrollo súper rápido y empaquetador eficiente.
- **Tailwind CSS (v4):** Framework de utilidades para un diseño a medida y responsivo.
- **Shadcn UI / Radix UI:** Colección de componentes base accesibles y modernos.
- **Zustand:** Manejo de estado global minimalista.
- **TanStack Query (React Query):** Optimización para el consumo asíncrono y caché de peticiones HTTP vía **Axios**.
- **React Hook Form + Zod:** Control de formularios ágil con validación de esquemas sólida.
- **Framer Motion:** Animación fluida de componentes.

---

## 🔗 Integración con el Backend

El presente frontend interactúa y se nutre directamente de de su capa de servicios backend (API RESTful, procesos de cálculo y conexión a Base de Datos SQL Server), el cual se encuentra operando en el siguiente repositorio:

⚙️ **Repositorio Backend:** [Backend-cotizador-frontera-vencol.git](https://github.com/alejandrosalas-SA/Backend-cotizador-frontera-vencol.git)

---
<div align="center">
  <small>Desarrollado para la gestión interna de <b>Seguros Altamira</b>.</small><br/>
  <small>© 2026 Todos los derechos reservados.</small>
</div>
