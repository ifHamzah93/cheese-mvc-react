# The Categories View

- [previous: `1-config.md`](./1-config.md)
- [next: `3-cheeses-view.md`](./3-cheeses-view.md)
- topics
  - registering React Router routes
  - view and child components
  - the declarative cycle approach
  - stateful components
  - form validation
  - the Axios library
  - using environment variables
  - making AJAX requests
  - prop types
- components
  - View `<Route>` components
  - `<CategoriesView>`
    - `<CategoryForm>`
    - `<CategoriesList>`

# Views & Components: Part One

Now that the base configuration is complete it's time to move onto the View components and their constituent components. There are plenty of approaches that can be used for building React applications. We will use my "declarative cycling" approach in this guide. You can read or review the approach in [`declarative-cycling.md`](./declarative-cycling.md) or plow along blissfully with the rest of this guide.

# The Routes

Our application will be made up of 4 routes (that were added as links in the `<NavBar>)

- `/`: Home View
  - this component is yours to customize
- `/cheeses`: Cheeses View
- `/categories`: Categories View
- `/menus`: Menus View

Let's begin by following the **Declare** step of the cycle. Our `<Route>` components don't have any special behavior beyond matching a path to the View component it will render.

Your tasks:

- create the files listed below (new files have a `*` next to them)
- copy the starter code to its file
- import the View components
- implement the Route components for each View

```sh
src/
  index.js
  App.js
  Routes.js
  components/
* views/
*   HomeView.js
*   CheesesView.js
*   CategoriesView.js
*   MenusView.js
```

`src/Routes.js`

```js
import React from "react";
import { Switch, Route } from "react-router-dom";
// TODO: import View components from their files

const Routes = () => (
  <Switch>
    {/* TODO: create Routes for each view */}
    <Route exact path="" component={} />
  </Switch>
);

export default Routes;
```

The `<Switch>` component is used to match paths. It behaves like a `switch() {}` statement in JavaScript but for `<Route>` component paths.

# The Views

We will now move to the next level - our (Parent) View components and their constituents. We have four choices of View components to begin with. Let's consider the dependencies that each have on one another:

- Home View
  - no dependencies
  - optional, should be completed last
- Cheeses View
  - depends on Categories View since each Cheese needs a category to be created
- Categories View
  - no dependencies
- Menus View
  - (partially) depends on Cheeses View to add cheeses to a menu once it has been created
    - by extension is dependent on Categories View

With the dependencies determined the order we should approach this build is:

- Categories View
- Cheeses View
- Menus View
- Home View

You may have also decided to approach it with partial completion:

- Categories View
- partial Menus View (everything except adding / viewing cheeses)
- Cheeses View
- complete Menus View
- Home View

## The `<CategoriesView>` Component

The Categories View component is responsible for:

- rendering a form component for creating a new category
- rendering a table component for listing existing categories
- requesting a list (collection) of categories from the API
- updating the list of categories when a new one is created from the form
  - **note that this would normally be handled by an application state manager like**
    - React Context
    - Redux

With these requirements in mind lets begin with the **Declaration** step of the cycle.

- state
  - `categories`: an array of category objects
    - initial value: `[]` empty array
- methods
  - lifecycle
    - `componentDidMount`: where we will make an API request for the current state of categories
  - handlers
    - `addToCategories`: receives a new category to add to its list
- rendering
  - grid `<Container>`: to hold and position its children
  - `<CategoryForm>` component
    - handler props
      - `addCategory` prop handler to use `addToCategories`
        - will be called when the form is submitted and new category is received from the API
  - `<CategoriesList>` component
    - data props
      - `categories` list

Your tasks

- create the files listed below
- copy the starter code to its file
- complete the TODOs in the snippet

directory structure

```sh
src/
  index.js
  App.js
  Routes.js
* utilities/ <--- non-JSX utilities
*   api-request.js <--- makes API requests
  components/ <--- non-view components
*   category/ <--- category related components
*     CategoryForm.js
*     CategoriesList.js
    CheeseNav.js
    Footer.js
  views/
    index.js <--- optional for bundling directory exports
    HomeView.js
    CheesesView.js
    CategoriesView.js <--- copy and complete starter code
    MenusView.js
```

`src/views/CategoriesView.js`

```js
import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import request from "../utilities/api-request";
import CategoriesList from "../components/category/CategoriesList";
import CategoryForm from "../components/category/CategoryForm";

class CategoriesView extends Component {
  state = {
    // TODO: declare initial state
  };

  async componentDidMount() {
    // request doesnt exist yet but we expect it to behave this way
    // meaning execute an HTTP GET request at api-domain/categories
    const res = await request.get("/categories");
    const categories = res.data; // the response data is the category collection list

    // TODO: implement updating state with the categories from the API
  }

  addToCategories = category =>
    this.setState(state => {
      const { categories } = state;
      // TODO: implement returning a new state with the category added to categories list
    });

  render() {
    const { categories } = this.state;

    return (
      <Container>
        <Row>{/* TODO: declare the CategoryForm component and props */}</Row>
        <br />
        <Row>{/* TODO: declare the CategoriesList component and props */}</Row>
      </Container>
    );
  }
}

export default CategoriesView;
```

Now that we have declared the pieces we need and implemented the pieces we understand let's break down a strategy for the Implementation step at the next level of the cycle. We can do this by taking stock of the pieces that still need to be implemented and their dependency chain:

- components
  - `<CategoryForm>`
    - depends on `request`
      - need to make a `POST` request to the API to submit a new category
  - `<CategoriesList>`
    - indirectly depends on `request`
      - our `<CategoriesView>` needs to make a `GET` request to the API to get the list of categories used as a data prop to this component
    - depends on the `<CategoryForm>`
      - we have to create categories first to display them
- utilities
  - `request`
    - no dependencies

From this analysis we can see that the `request` utility should be our first target. After that we should implement the `<CategoryForm>` and finally the `<CategoriesList>`.

### The `request` utility

The request utility will be used by components in our application for making requests to the Cheese API. We will use a library called `axios` that will make sending requests and using their responses easier than the native JavaScript `fetch`.

The documentation for `axios` can be [found here](https://www.npmjs.com/package/axios), here is a summary:

- Axios is a promise-based HTTP request library
- it uses declarative methods which correspond to the HTTP method you want to use
- every request uses a request url along with an options object for customizing the data, headers, and other aspects of the underlying HTTP request
- if all of your requests use the same base configuration you can create a custom Axios instance
  - this is useful for making requests to APIs that only differ by endpoints
  - once you have an instance you can make requests by just passing the endpoint path rather than

Below is a the `api-request` module. It is a [custom Axios instance](https://www.npmjs.com/package/axios#creating-an-instance) that uses a base URL (our API entry point) and a header that tells the API to send us JSON.

`utilities/api-request.js`

```js
import axios from "axios";

const request = axios.create({
  baseURL: process.env.REACT_APP_API_DOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
});

export default request;
```

You may be confused by the line `process.env.REACT_APP_API_DOMAIN` which sets the `baseURL` option. This is an environment variable meaning its value is provided external to the source code. We do this to make our application more flexible, in the same way that we set our database connection parameters to environment variables. This allows us to easily set the value depending on whether we are in a local development environment or deployed in production.

When we are working locally on our machines we can set this variable using a `.env` file. This file lets us list any environment variables we want to load into the application. Create React App includes a utility called `dotenv` ([documentation here](https://www.npmjs.com/package/dotenv)) that reads `.env` files when an application starts up. For safety CRA requires that all environment variables be preceeded with `REACT_APP_`, you can read more about this decision [here](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables).

Since we are developing locally we can set the domain to `localhost` on the port our Cheese API is running on. When we deploy the SPA we can set the value to the live domain of the deployed API. Create this file in the root directory of the application (at the same level as the `src/` directory).

directory structure

```sh
cheese-react-spa/
  node_modules/
  public/
  src/
  package-lock.json
  package.json
  .gitignore
* .env
```

`cheese-react-spa/.env`

```sh
REACT_APP_API_DOMAIN=http://localhost:8080/api
```

Now we can use `get()`, `post()`, and `delete()` methods on our `request` Axios instance. We have already made use of the `get()` method in the `<CategoriesView>` component. These will make corresponding HTTP requests to our API according to the endpoint and options data we provide when invoking the methods. Let's proceed to the `<CategoryForm>` component where we will make use of the `post()` method to submit the form.

### The `<CategoryForm>` Component

The Category Form component is responsible for:

- rendering a form with an input for the category name
- validating the name value provided by the user
  - should be between 3 and 15 characters in length
- submitting the form by sending its data in an API request
- updating the Parent (`<CategoriesView>`) with the new category received from the API

With these requirements in mind lets begin with the **Declaration** step of the cycle.

- state
  - `name`: the value of the name input
    - initial value: `""` an empty string
  - `disabled`: a boolean that controls whether the form can be submitted
    - controlled by validating the input
    - initial value: `true` to prevent the form being submitted when it is empty
- props
  - `addCategory`: handler method from the Parent
    - for updating the Parent component state with new data from the API when the form is submitted
- methods
  - handlers
    - `handleInputChange`: handles an input change on the form
      - used to establish 2-way binding between form inputs and the component state holding the input values
    - `resetForm`: resets the form after it has been submitted
      - used to clear the input values
    - `handleSubmit`: handles submitting the form
      - prevents default behavior that causes a page to reload when a form is submitted
      - makes an AJAX request to the API with the form data
      - updates the Parent component with the response data using `addCategory` prop handler method
- rendering
  - `<Form>`: container for holding input elements
  - input components
    - a text input for the name field
      - attribute props
        - `name` the name of the input field
        - `value` for 2-way binding with the form state
        - `minLength` for providing validation cues
        - `maxLength` for providing validation cues
      - event props
        - `onChange` for managing 2-way binding with the form state
    - a submit button
      - attribute props
        - `disabled` for controlling whether the form is allowed to be submitted
      - event props
        - `onClick` for submitting the form

Your tasks:

- copy the starter code to the file
- complete the TODOs

`src/components/category/CategoryForm.js`

```js
import React, { Component } from "react";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import request from "../../utilities/api-request";

class CategoryForm extends Component {
  state = {
    // TODO: implement initial state
  };

  handleInputChange = event => {
    // the value attribute of the input that was changed
    const { value } = event.target;
    // true or false based on whether the value is invalid
    const disabled = // TODO: implement an expression that will set disabled based on the validity of the input value

    // TODO: update state with the new values of "disabled" and "name"
  };

  // sets the value to an empty string to reset the form
  resetForm = () => this.setState({ name: '' });

  handleSubmit = async event => {
    event.preventDefault();
    const { name } = this.state;
    const { addCategory } = this.props;

    const res = // TODO: send a POST request with the form data (don't forget to await the Promise!)
    const category = res.data;

    // TODO: send the new category back to the <CategoriesView> Parent
    this.resetForm();
  };

  render() {
    const { disabled, name } = this.state;

    return (
      <Container className="text-center">
        <h2>Create a Category</h2>
        <Form>
          <Form.Group as={Col} sm={{ offset: 4, span: 4 }}>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              name="name"
              // TODO: implement the remaining props
            />
          </Form.Group>
          
          <Button
            type="submit"
            variant="primary"
            // TODO: implement the remaining props
          >
            Create
          </Button>
        </Form>
        <hr />
      </Container>
    );
  }
}

CategoryForm.propTypes = {
  // TODO: implement the prop types for this component (see below)
};

export default CategoryForm;
```

### Prop Types: Intro

What are `propTypes`? Prop types are a way to add "type checking" the values of props that a component receives. Since JavaScript is a dynamically typed language it does not enforced type checking but React provides this mechanism for us.

If a component receives props that do not match those defined in its prop types then an Error will be thrown by React. This Error can be caught and corrected during development rather than an Error in production.

A component's prop types is an object with prop names whose values are the "shapes" of the props and that it expects to receive. You can optionally mark the prop as required or define a default value for the prop as well. The shape can refer to a simple string prop or a complex object prop which defines the types of that object's properties.

The full documentation on prop types can be [found here](https://www.npmjs.com/package/prop-types) and a more exploratory article from the React team can be [found here](https://reactjs.org/docs/typechecking-with-proptypes.html). We will cover some of the basics here but for a better understanding or implementing more complex scenarios refer to the documentation.

There are two ways of defining the prop types object of a component, both of which require importing the `prop-types` library. You declare the prop name as a key then use the `PropTypes` library object to access the type you want to define.

If you have a class-based (stateful) component then you can define them as a `static` property in the class body:

```js
import React, { Component } from "react";
import PropTypes from "prop-types";

class ComponentName extends Component {
  static propTypes = {
    propName: PropTypes.string, // or any other prop type
  };

  static defaultProps = {
    propName: "default value", // whatever value you want as a default
  };
}
```

The other approach is to define them external to the component. The latter approach can be used for both class-based and functional components. For consistency in this guide we will be defining our prop types using this approach.

```js
import React, { Component } from "react";
import PropTypes from "prop-types";

class ComponentName extends Component {}

ComponentName.propTypes = {
  propName: PropTypes.string, // or another prop type
};

ComponentName.defaultProps = {
  propName: 'default value',
}

function FunctionalComponentName = () => ();

FunctionalComponentName.propTypes = {
  propName: PropTypes.string, // or another prop type
};

FunctionalComponentName.defaultProps = {
  propName: 'default value',
}
```

It is a common practice to define your prop type / default props objects at the top of the component file then assign them at the end (after the component has been define). This makes it easy for anyone to see what prop "dependencies" the component has without having to scroll to the bottom. For simplicity this practice isn't followed in this guide but you can use the following example as a reference:

```js
import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
  propName: PropTypes.func.isRequired, // any other type, .isRequired is optional
};

class ComponentName extends Component {
  // internal
  static propTypes = propTypes;
}

// external: assign the propTypes object after the component has been defined
ComponentName.propTypes = propTypes;
```

When defining prop types you want to consider four aspects for each prop:

- what is the name of the prop
  - this is the key in the `propTypes` and `defaultProps` objects
- what is the expected type or "shape" of the prop
  - this is the value defined using the imported `PropTypes` library object
- is the prop required?
  - append `.isRequired` to the end of the value
  - if `.isRequired` is not appended the prop is considered optional
- should the prop have a default value if it is not received from a Parent?
  - define the prop and its default value in the `defaultProps` object
  - if a component does not have defaults then the `defaultProps` object does not need to be defined

Let's implement the prop types for the `<CategoryForm>` component as an example. We know that it receives one prop (a handler method). The type of this prop is a function (`PropTypes.func`). It is required since our component will break if we don't receive it (`.isRequired`). We do not want to provide a default value since it is required.

```js
CategoryForm.propTypes = {
  addCategory: PropTypes.func.isRequired,
};
```

As an example here is how you would provide a default value

```js
CategoryForm.defaultProps = {
  addCategory: () => {},
};
```

Now that the component is complete let's move onto the `<CategoriesList>` component and finish the Categories View!

### The `<CategoriesList>` Component

The Categories List component is responsible for:

- rendering a table component
- creating table rows for each category in the categories list

Because this component's responsibilities revolve around rendering behavior only we can write it as a stateless functional component. Let's explore the **Declaration** step of the cycle:

- props
  - `categories`: the list of categories
    - used for creating category rows in the table
- utility functions
  - `createCategoryRow`: transforms a category into a JSX table row
- rendering
  - `<Table>`: container for holding the category rows
    - a header row
    - iterating over the `categories` to transform it into category rows

Your tasks:

- copy the starter code to the file
- complete the TODOs

`src/components/category/CategoriesList.js`

```js
import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';

const createCategoryRow = category => (
  // TODO: implement this utility function
  // it should return a row and column with the category name
);

const CategoriesList = (props) => {
  const { categories } = props;

  return (
    <Container>
      <Row>
        <Col>
          <h2 className='text-center'>Categories</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={{ span: 6, offset: 3 }}>
          <Table size='sm' bordered>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {/* TODO: implement the body (category name rows) */}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

CategoriesList.propTypes = {
  // TODO: implement the prop types, this one is tricky (see below)
};

export default CategoriesList;
```

### PropTypes: Shapes

This component's prop types are more complex. You may have considered just putting `PropTypes.array.isRequired` but realized there is no `.array` type. Instead, playing the dot game, you came across `.arrayOf()`. This is because simply listing a prop type as an array is not sufficient for type checking. Arrays in JavaScript can have many different types in them, including other data structures like objects. The `arrayOf()` type is the tool we will use to describe what the array of is _of_ in terms of its "shape". If the array were made up of simple primitives we could just add something like `PropTypes.arrayOf(PropTypes.string)` which translates to an expected shape of `[String]`.

In this component we expect an array of `CategoryEntity` shaped objects. At the top of this guide, in the API Reference section, the shape of the category entity was defined. Recall that the shape of an entity from a REST API describes the properties of each resource entity and what types each of them are.

```js
// CheeseEntity
{
  id: Number;
  name: String;
  description: String;
  category: CategoryEntity;
}

// CategoryEntity
{
  id: Number;
  name: String;
}

// MenuEntity
{
  id: Number;
  name: String;
}
```

You can see that the `CategoryEntity` is a pretty simple object. But notice that it is used to define the shape of an object property in the `CheeseEntity`. This means that the shape we define for this component will need to be used when we implement the Cheese related components. In otherwords this prop type shape will be shared across multiple components.

Let's begin by declaring the prop type then implement

Instead of defining the shape in this component's file let's invest towards a cleaner code base by creating a prop types file in our utilities directory. We will use this file as a central location for any shared prop types and shapes that will be reused.

directory structure

```sh
src/
  utilities/
    api-request.js
*   prop-types.js
```

Next let's import the shape from this new file and use it in the prop types for the Category List component. The file is empty for now but we can shell out its usage before implementing it.

`src/components/category/CategoriesList.js

```js
// other imports
import { categoryType } from "../../utilities/prop-types";

// component code

CategoriesList.propTypes = {
  categories: PropTypes.arrayOf(categoryType).isRequired,
};
```

Now how do we define this shape using the Prop Types library? Using the `PropTypes.shape()` method and the defining each of the property name / type pairs inside.

`src/utilities/prop-types.js`

```js
import PropTypes from 'prop-types';

// defining the base entity shape
const categoryEntity = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

// a Prop Types definition using the base entity shape
// exported as a named export to match how we imported it in CategoriesList.js
export const categoryType = PropTypes.shape(categoryEntity);

// could also be written in one step as
export const categoryType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
});
```

Since you are already in the file and foresee needing the other entity shapes you can implement and export them now. Think about how you will implement the `CheeseEntity` shape which uses the category shape as one of its property types.

# Section Complete

Next let's begin with the [Cheeses View](./3-cheeses-view.md)
