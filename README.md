## CyberLootApplication — Patitas Veloces Team

Brief project guide and collaboration standards for e-commerce development.

---

### Table of Contents
- **Commit Conventions**
- **Branching Model**
- **Technologies and Libraries**
- **Project Structure**
- **Code of Conduct**

---

### Commit Conventions
To maintain a clear history, each commit must start with a prefix that describes the type of change, followed by a brief description.

| Type | Description | Example |
| --- | --- | --- |
| `feat` | New feature | `feat: add keyword-based search functionality` |
| `fix` | Bug fix | `fix: correct bug in product image upload` |
| `style` | Formatting changes (spaces, quotes, etc.) | `style: fix indentation in product card component` |
| `docs` | Documentation changes | `docs: update README with installation instructions` |

---

### Branching Model
We use a simplified Git Flow:

- **`main`**: main branch, always stable and production-ready. No direct commits.
- **`develop`**: integration branch where new features are merged before going to `main`.
- **Feature branches**: create one branch per feature with the format `feature/<feature-name>`.
  - Examples: `feature/user-profile`, `feature/product-search`.

---

### Technologies and Libraries
To maintain consistency, only the following approved technologies and libraries will be used.

**Front-end**
- **HTML5**: page structure and semantic markup.
- **CSS3**: styling and design with organized component-based architecture.
- **TypeScript**: strongly-typed client-side logic and better development experience.

**Libraries/Frameworks**
- **Vanilla TypeScript**: no major frameworks (React, Angular, Vue) to strengthen foundational skills.
- **Axios**: HTTP request handling (e.g., asynchronous comment system).
- **Vite**: fast development server and build tool for TypeScript compilation.

**Server Tools**
- Simple local server: Node.js with Express or Python with Flask to simulate API and serve static files.

**Database**
- Simulated with JSON file or JavaScript object array. Could be migrated to a real database in the future.

---

### Code of Conduct

#### Our Commitment
As a development team, we are committed to creating an inclusive and collaborative environment for all project members.

#### Expected Behavior
- **Mutual respect**: Treat all team members with courtesy and professionalism.
- **Clear communication**: Be specific in code comments, issues, and commit messages.
- **Active collaboration**: Participate in code reviews, help solve problems, and share knowledge.
- **Responsibility**: Meet agreed deadlines and communicate any delays in advance.

#### Unacceptable Behavior
- Derogatory, discriminatory, or inappropriate language or comments.
- Intimidating behavior, harassment, or personal attacks.
- Inappropriate use of confidential project information.
- Intentional blocking of team progress.

#### Conflict Resolution
1. **Direct conversation**: Attempt to resolve differences through respectful communication.
2. **Team mediation**: If unresolved, involve other team members.
3. **Escalation**: As a last resort, escalate to project supervision.

#### Enforcement
Team members who do not comply with this code of conduct may be removed from the project after appropriate warnings.