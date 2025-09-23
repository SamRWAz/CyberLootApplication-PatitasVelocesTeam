## CyberLootApplication — Patitas Veloces Team

Breve guía del proyecto y estándares de colaboración para el desarrollo del e‑commerce.

---

### Índice
- **Convenciones de commits**
- **Modelo de ramas**
- **Tecnologías y librerías**

---

### Convenciones de commits
Para mantener un historial claro, cada commit debe iniciar con un prefijo que describa el tipo de cambio, seguido de una descripción breve.

| Tipo | Descripción | Ejemplo |
| --- | --- | --- |
| `feat` | Nueva funcionalidad | `feat: add keyword-based search functionality` |
| `fix` | Corrección de error | `fix: correct bug in product image upload` |
| `docs` | Cambios en documentación | `docs: update README with installation instructions` |

---

### Modelo de ramas
Se utiliza un Git Flow simplificado:

- **`main`**: rama principal, siempre estable y lista para producción. No hacer commits directos.
- **`develop`**: rama de integración donde se fusionan nuevas funcionalidades antes de pasar a `main`.
- **Ramas de feature**: crear una rama por funcionalidad con el formato `feature/<nombre-feature>`.
  - Ejemplos: `feature/user-profile`, `feature/product-search`.

---

### Tecnologías y librerías
Para mantener consistencia, se usarán únicamente las tecnologías aprobadas a continuación.

**Front-end**
- HTML5: estructura de páginas.
- CSS3: estilos y diseño. (Sass/Less de considerarse, bajo acuerdo previo.)
- JavaScript (ES6+): lógica interactiva en cliente.

**Librerías/Frameworks**
- Sin frameworks principales (React, Angular, Vue). Se prioriza Vanilla JavaScript.
- Axios: manejo de solicitudes HTTP (ej. sistema de comentarios asíncrono).

**Herramientas de servidor**
- Servidor local simple: Node.js con Express o Python con Flask para simular API y servir archivos estáticos.

**Base de datos**
- Simulada con archivo JSON o arreglo de objetos en JavaScript. A futuro podría migrarse a una base de datos real.