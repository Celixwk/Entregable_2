# Entregable_2 - Tablero de Mensajes / Chat con SOLID y Motores de Plantilla

Proyecto desarrollado con **Node.js**, **Express** y **Handlebars** aplicando los principios de diseño de software **SOLID**.

## 🚀 Características
- **Motores de Plantilla (Handlebars)**: Renderizado del lado del servidor para vistas dinámicas y componentes.
- **Cuadro Grande de Mensajes**: Visualización clara de todos los mensajes publicados, indicando quién escribió (autor), la hora exacta y el contenido.
- **Persistencia Desacoplada**: Almacenamiento modular (JSON / Memoria) intercambiable mediante inyección de dependencias.
- **Arquitectura SOLID**:
  - **S (Single Responsibility)**: Separación clara de responsabilidades entre Modelos (`Message.js`), Controladores (`MessageController.js`), Servicios (`ChatService.js`) y Repositorios.
  - **O (Open/Closed)**: Sistema de persistencia extensible mediante la abstracción base `MessageRepository.js`.
  - **L (Liskov Substitution)**: `FileMessageRepository` y `InMemoryMessageRepository` son sustituibles sin afectar la lógica de negocio.
  - **I (Interface Segregation)**: Contrato mínimo y enfocado para operaciones de guardado y lectura.
  - **D (Dependency Inversion)**: Inversión de dependencias en `src/index.js` (Composition Root), inyectando el repositorio en el servicio y el servicio en el controlador.

---

## 📁 Estructura del Proyecto

```text
├── public/
│   ├── css/chat.css              # Estilos modernos y responsivos
│   ├── js/chat.js                # Interacción asíncrona del cliente
│   └── img/
├── src/
│   ├── controllers/
│   │   └── MessageController.js  # [SRP/DIP] Controlador HTTP
│   ├── data/
│   │   └── messages.json         # Persistencia de mensajes
│   ├── models/
│   │   └── Message.js            # [SRP] Entidad de dominio con validación y hora
│   ├── repositories/
│   │   ├── MessageRepository.js         # [ISP/OCP] Contrato base
│   │   ├── InMemoryMessageRepository.js # [LSP] Persistencia en memoria
│   │   └── FileMessageRepository.js     # [LSP/OCP] Persistencia en disco
│   ├── routes/
│   │   ├── messages.router.js    # [SRP] Rutas API (/api/messages)
│   │   └── views.router.js       # [SRP] Rutas de vistas Handlebars
│   ├── services/
│   │   └── ChatService.js        # [SRP/DIP] Lógica de negocio
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars  # Layout principal con navegación
│   │   ├── chat.handlebars      # Tablero y cuadro grande de mensajes
│   │   ├── index.handlebars     # Vista principal de inicio
│   │   └── contact.handlebars   # Vista de contacto
│   ├── index.js                  # Composition Root y servidor Express
│   └── util.js                   # Configuración de __dirname y Multer
├── package.json
└── README.md
```

---

## 🛠️ Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor:**
   ```bash
   npm start
   ```

3. **Acceder a la aplicación:**
   - **Inicio**: [http://localhost:3000](http://localhost:3000)
   - **Tablero de Mensajes / Chat**: [http://localhost:3000/chat](http://localhost:3000/chat)
