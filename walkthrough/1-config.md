# Base Configuration

- [previous: `0-intro`](./0-intro.md)
- [next: `2-categories-view`](./2-categories-view.md)
- topics
  - Create React App
  - installing dependencies
  - React Router configuration
  - React Fragment usage
  - stateless functional components
- components
  - `<App>`
  - `<Router>`
  - `<CheeseNav>`
  - `<Footer>`

## Shortcut
Depending on how much time is available to complete this project you can take a shortcut through the config process by cloning this repo and using the starter code in the `code/` directory. 

```sh
git clone https://github.com/the-vampiire/cheese-mvc-react
```

This will provide starter code up to the Navigation and Footer section. Explore the starter code files. If the code is clear to you then you can skip to [Navigation and Footer](#Navigation-and-Footer). Otherwise read through starting at the following section.

## Create React App

Create React App is a node module command line tool that helps you get started with React quickly. It will generate a base project with all of the boilerplate code pre-written so you can focus on writing your components and learning React rather than dealing with configuration.

Our first step is to use the `create-react-app` module to generate our starter code. To do this we will use a utility provided by NPM called `npx`. NPX lets us use node modules without having to install them globally on our machine. It will temporarily download the module, use it, then clean up after itself.

In your command line first navigate to your JavaScript projects directory and then enter `npx create-react-app cheese-react-spa`. This command instructs Create React App to generate a new React project in a directory called `cheese-react-spa` (the name of our project). In the future you can use the same command to generate other projects, just change the project name as needed, `npx create-react-app <YOUR-PROJECT-NAME>`.

## Cleanup Boilerplate

In your newly created `cheese-react-spa/` directory we will do some cleanup of unused code and comments. This will make it easier for us to stay focused on our own build. There is nothing wrong with any of this boilerplate code it is just easier to stay focused with less distractions.

In the `src/` directory

- Delete the following files: `App.css`, `App.test.js`, `index.css`, `logo.svg`, `serviceWorker.js`
- Edit the following files:

`App.js`:

- remove the unused imports and boilerplate
- since `<App>` is a stateless functional component it does not need to be a class
- rewrite `<App>` as an arrow function

`src/App.js`

```js
import React from "react";

const App = () => <div>{/* we will fill this part in soon! */}</div>;

export default App;
```

`index.js`: remove the service worker lines and unused imports so it appears like this:

`src/index.js`

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```

In the `public/` directory

- Delete the following files: `favicon.ico` and `manifest.json`
- Edit the `index.html` file so it appears like this:

`public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <!-- add Bootstrap styling -->
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
      integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
      crossorigin="anonymous"
    />
    <title>Cheese React SPA</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

## Installing Packages

Now that our React boilerplate has been cleaned up we can use NPM to install the other modules we will be using in our build. We will be using:

- `react-router-dom` to manage routing in our SPA
- `react-bootstrap`, `react-router-bootstrap`, and `boostrap` to apply declarative, component-based, CSS styling
- `axios` to manage asynchronous network requests to our Cheese Web API

You can install these packages by entering the following into your terminal:

```sh
npm i react-router-dom react-bootstrap react-router-bootstrap bootstrap axios
```

Confirm that the packages were installed by looking at the `package.json` file. It should contain the following under the `dependencies` field.

- Note that the versions of the packages may have increased, **as long as they have the same major, first number, version** your dependencies are correct:

```js
"dependencies": {
  "axios": "^0.18.0",
  "bootstrap": "^4.3.1",
  "react": "^16.8.2",
  "react-bootstrap": "^1.0.0-beta.5",
  "react-dom": "^16.8.2",
  "react-router-bootstrap": "^0.24.4",
  "react-router-dom": "^4.3.1",
  "react-scripts": "2.1.5"
},
```

## Setting up React Router

React Router is a library that helps us manage navigation across different views in our SPA. While a SPA never reloads or navigates in the traditional sense, the concept of navigation through URLs is too familiar and useful to discard.

React Router will let us manage paths in the URL bar which will in turn instruct the SPA to render the corresponding views. From the user's perspective it appears they are navigating normally which lends itself to a better user experience.

For a great introduction to React Router and its usage you can visit Tyler McGinnis's [article](https://tylermcginnis.com/react-router-philosophy-introduction/) or [video](https://youtu.be/3B588JwyT18) on the subject. It is in your best interest to read and/or watch his introduction before proceeding!

We will begin by creating a `Routes` component file which will hold all of the paths and the view components that each will render. This file will serve as a registry of all the views our SPA provides. For now we will just set up the essentials of the Router and implement it later in the guide.

First create a `Routes.js` file in the `src/` directory. You want this file to be at the same level as `App.js`. Inside of `Routes.js` enter the following code:

directory structure

```sh
src/
  index.js
  App.js
* Routes.js
```

`src/Routes.js`

```js
import React from "react";
import { Switch, Route } from "react-router-dom";

const Routes = () => (
  <Switch>
    {/* we will implement these Route components later */}
    <Route exact path="" component={} />
  </Switch>
);

export default Routes;
```

- The commented `<Route>` tag will serve as a placeholder for when we begin adding our views.
- Each view will have its own `<Route>` similar to how we set up route handlers in Spring Cheese MVC.
- Notice we import from `react-router-dom` **not** `react-router`. React Router can be used for other applications beyond the web, `react-router-dom` exposes the functionality we need for routing in a web SPA.

Next we will set up the `<Router>` component in `App.js`. This component is the **controller** of all of our routes. It functions very similarly to a controller class you developed in the Spring CheeseMVC project. When a path (assigned to a `<Route>`) is matched in the `<Router>` it will render whatever component is assigned to that `<Route>`.

In `App.js` we will import `<BrowserRouter>` from `react-router-dom` and then introduce it at the highest level of our application, the `<App>` component. We will use an import alias to rename this component to `<Router>`. Originally React Router used this name but when it expanded to manage routing in non-web applications it renamed it to `<BrowserRouter>` to avoid naming conflicts.

It is important that the `<Router>` component is at the top level as it will render everything inside it, known as its **children**. This lets the `<Router>` control exactly what rendered on screen when a view route path is entered. For now the only children it will contain is our imported `<Routes>` component from our registry.

`src/App.js`

```js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./Routes";

const App = () => (
  <Router>
    <Routes />
  </Router>
);

export default App;
```

## Navigation and Footer

Before we begin writing our views we want to create a consistent navbar and footer that will appear above and below each path-based view. The navbar will hold navigation links to each of the views we will create - Menu, Cheese, and Category. The footer is an opportunity for you to sign your name and provide a link to your GitHub! Let's begin by creating a `components/` directory and two placeholder component files within it.

- create `src/components/` directory
- create two files in `components/` that will be empty for now
  - `CheeseNav.js`
  - `Footer.js`

directory structure

```sh
src/
  index.js
  App.js
  Routes.js
* components/
*   CheeseNav.js
*   Footer.js
```

### The `<CheeseNav>` Component

We will be using the [`<NavBar>`](https://react-bootstrap.github.io/components/navbar/#navbars) and [`<Nav>`](https://react-bootstrap.github.io/components/navs/) components to provide some automatic Bootstrap styling to our navigation bar. Traditionally we had to write Bootstrap class names in our HTML tags to apply styling. With `react-bootstrap` we use declarative components which provide CSS styling to its child components. All you have to do is import the pre-styled component and add whatever content you'd like inside (as its children)!

You can read more about `react-bootstrap` and its styled components [here](https://react-bootstrap.github.io/getting-started/introduction/). In this guide all of the styled components will be provided since they need to be tweaked to look nice and we want to use our time learning React not styling! That being said React Bootstrap has an awesome [reference guide](https://react-bootstrap.github.io/components/alerts) if you want to understand how it works and use it in your own future projects.

The `<Nav>` component will use a related library called `react-router-bootstrap`. From this library we will use `<LinkContainer>` components as children within the `<Nav`. These are styled React Router `<NavLink>` components that provide the same functionality but with bootstrap styling.

Recall that `<NavLink>`, like the React Router `<Link`> component, tells React Router which view component to render for the given path. Using these utility components we can enable our SPA behavior (only an initial page load) instead of using traditional `href` anchor tags (which would cause the page to load on each click).

`<Nav.Link>` give us the extra functionality of highlighing which link is active (matches the path). This provides a better UX as the user can understand where they currently are and which other links are available for navigation.

Our CheeseNav component will be a stateless functional component. It does not need to concern itself with any sense of state since its purpose is just to render the navigation links.

Your tasks:

- Use the `<LinkContainer>` and `<Nav.Link>` components to provide navigable links for the following views:
  - Home: `/`
  - Menus: `/menus`
  - Cheeses: `/cheeses`
  - Categories: `/categories`

Here is the starter code for this section:

`src/components/CheeseNav.js`

```js
import React from "react";
import Nav from "react-bootstrap/Nav";
import NavBar from "react-bootstrap/NavBar";
import { LinkContainer } from "react-router-bootstrap";

const CheeseNav = () => (
  <NavBar>
    <Nav>
      <LinkContainer to="/some/path/to/navigate">
        <Nav.Link>User Facing Link Text</Nav.Link>
      </LinkContainer>
      {/* TODO: implement the links */}
    </Nav>
  </NavBar>
);

export default CheeseNav;
```

### The `<Footer>` Component

The footer is also a functional stateless component. Below is a sample footer that you can use to customize.

`src/components/Footer.js`

```js
import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Footer = () => (
  <footer className="fixed-bottom">
    <Row className="text-center">
      <Col xs={12}>
        Coded by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/YOUR_USERNAME"
        >
          {/* TODO: sign your name and put your GitHub username above */}
        </a>
      </Col>
    </Row>
  </footer>
);

export default Footer;
```

### Importing the Components

Back in `App.js` we want to make use of our components. We want to position our navigation and footer components _around_ `<Routes>` so that they are always rendered on the screen. `<Routes>` will render the view component it is instructed to render according to the URL path. By wrapping our nav and footer around it we can ensure that any views will render between them.

`src/App.js`

```js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./Routes";
import CheeseNav from "./components/CheeseNav";
import Footer from "./components/Footer";

const App = () => (
  <Router>
    <CheeseNav />
    <Routes />
    <Footer />
  </Router>
);

export default App;
```

While our structure appears sound - a navbar and footer wrapping a view renderer (<`Routes`>) we have introduced a syntactical error. React Router's `<Router>` component, like all React components, may only directly render a single child. That child element can have multiple elements within it. To resolve this error we have two options.

The first is to wrap our child components in a `<div>` and call it a day. But this is poor design as it leads to an unecessary `<div>` element that serves no semantic purpose. This is a bandaid solution that good developers know to avoid.

Our second solution is to use a special component React provides which is designed for this exact situation. The `<Fragment>` component can be used to wrap children without adding excessive `<div>` elements that litter our DOM. You can read more about React `<Fragment>` components [here](https://reactjs.org/docs/fragments.html).

Let's fix this by importing `Fragment` from React. Alternatively you can use a shorthand syntax `<>` and closing `</>` tags. Both are acceptable in modern React applications. For clarity we will use the `<Fragment>` tag in this guide.

`src/App.js`

```js
import React, { Fragment } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./Routes";
import CheeseNav from "./components/CheeseNav";
import Footer from "./components/Footer";

const App = () => (
  <Router>
    <Fragment>
      <CheeseNav />
      <Routes />
      <Footer />
    </Fragment>
  </Router>
);

export default App;
```

# Section Complete

Next let's begin with the [Views & Components](./2-categories-view.md)
