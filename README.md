# Development-of-an-E-commerce-application

1. Commit Convention
To maintain a clear and readable commit history, we'll use a standardized convention. Each commit message must begin with a prefix that describes the type of change, followed by a concise description.

feat: A new feature (e.g., feat: add keyword-based search functionality).

fix: A bug fix (e.g., fix: correct bug in product image upload).

docs: Documentation changes (e.g., docs: update README with installation instructions).

2. Branching Model
We will use a simplified Git Flow branching model.

main: The main branch. It must always contain stable, production-ready code. Do not commit directly to this branch.

develop: The development branch. All new features are merged here before being deployed to main.

Feature Branches (feature-): Every new feature must be developed on a separate branch, with the format feature/feature-name. For example: feature/user-profile or feature/product-search.

3. Technologies and Libraries
To maintain consistency and avoid fragmentation, we will only use the following approved technologies and libraries.

Front-end:

HTML5: For the structure of all pages.

CSS3: For styling and design. We may consider Sass or Less if a preprocessor is needed, but this must be agreed upon.

JavaScript (ES6+): For all client-side interactive logic.

Libraries/Frameworks:

No major JavaScript frameworks (like React, Angular, or Vue) will be used for this project. The focus is on building the application with Vanilla JavaScript to strengthen foundational skills.

Axios: To handle HTTP requests (e.g., for the asynchronous comment system).

Server Tools:

A simple local server, for example, using Node.js with Express or Python with Flask, to simulate the API and serve static files. This is crucial for asynchronous functionality.

Database:

For this project, the database can be simulated with a JSON file or a JavaScript object array, which simplifies the setup and allows the focus to remain on the front end. In the future, we could migrate to a real database.