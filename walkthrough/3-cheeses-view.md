# The Cheeses View

- [previous: `2-categories-view.md`](./2-categories-view.md)
- [next: `4-menus-view.md`](./4-menus-view.md)
- topics
  - conditional expressions in JSX
  - dynamic (multi-use) components
  - setting state using current state
  - multi-input forms and validation
- components
  - `<CheesesView>`
    - `<CheeseForm>`
    - `<CheesesList>`
    - `<CheeseCategorySelector>`

Now that we have completed the Categories View it's time to implement the next piece of our dependency chain - the Cheeses View. It will have a form to add a new cheese and a table of cheeses with the ability to view cheeses per category. This is the most complex set of components for this project. The good news is that you will learn a lot implementing it!

Our Cheese View will be made up of three sub-components. The `<CheesesList>` component will render a table of cheeses with their name, category (name), and description. The `<CheeseCategorySelector>` component will provide a dropdown menu for selecting a category. When the dropdown menu changes we will use the `onChange` event to fetch cheeses for the chosen category. Finally, the `<CheeseForm>` component will be responsible for receiving user input of the name, category, and description and submitting this data to the backend for Cheese creation.

## The `<CheesesView>` Component

The Cheeses View component is responsible for:

- rendering a form component for creating a new cheese
- rendering a table component for listing cheeses
- rendering a category dropdown menu for displaying all cheeses or for a specific category
- requesting a list (collection) of cheeses from the API
- updating the list of cheeses when a new one is created from the form
  - **note that this data and several others throughout the application would normally be handled by an application state manager to prevent repeated fetching of resources**
    - React Context
    - Redux

With these requirements in mind lets begin with the **Declaration** step of the cycle.

- state
  - `cheeses`: an array of cheese objects
    - initial value: `[]` empty array
  - `categories`: an array of category objects
    - initial value: `[]` empty array
  - `selectedCategoryID`: the ID of the currently selected category
    - initial value: `""`: empty string
      - indicates that no category has been selected, show all cheeses
- methods
  - lifecycle
    - `componentDidMount`: where we will make an API request
      - for the current state of the cheeses collection
      - for the current state of the categories collection
      - update state with the `cheeses` and `categories`
  - handlers
    - `addToCheeses`: receives a new cheese to add to its cheeses list
    - `deleteCheese`: receives a cheese ID
      - sends a delete request
      - updates state by removing the cheese from its cheeses list
    - `getCategoryCheeses`: receives a category change event object
      - gets the category ID from the event object
        - `event.target` can be used to access the value of the chosen option
      - if the category ID is an empty string, `""`, then it fetches all the cheeses
      - otherwise it fetches the cheeses with the chosen category ID
      - sets state
        - with the new value of `categoryID`
        - the cheeses list with cheeses for that category
- rendering
  - grid `<Container>`: to hold and position its children
  - `<CheeseForm>`
    - data props
      - `categories` list
    - handler props
      - `addCheese` to use the `addToCheeses` method
        - will be called when the form is submitted and new cheese is received from the API
  - `<CheeseCategorySelector>`
    - data props
      - `categories` list
      - `firstOption` the user facing text, `"All Cheeses"` of the first option in the select menu
      - `categoryID` value of the chosen category from component state
    - handler props
      - `handleChange` to use the `getCategoryCheeses` method
  - `<CheesesList>`
    - data props
      - `cheeses` list
    - handler props
      - `removeCheese` to use the `deleteCheese` method
        - should only be passed in if the `categoryID` is `""` meaning "all cheeses"
          - there is only a `DELETE /cheeses/:cheeseID` endpoint
          - cheeses can not be deleted within a category since the `category_id` column has a `NOT NULL` constraint

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
  utilities/
  components/
    category/
*   cheese/
*     CheeseForm.js
*     CheesesList.js
*     CheeseCategorySelector.js
    CheeseNav.js
    Footer.js
  views/
    HomeView.js
*   CheesesView.js <--- copy and complete starter code
    CategoriesView.js
    MenusView.js
```

`src/views/CheesesView.js`

```js
import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import request from "../utilities/api-request";
import CheesesList from "../components/cheese/CheesesList";
import CheeseForm from "../components/cheese/CheeseForm";
import CheeseCategorySelector from "../components/cheese/CheeseCategorySelector";

class CheesesView extends Component {
  state = {
    // TODO: implement the initial state
  };

  async componentDidMount() {
    const cheeseRes = // TODO: implement a request to the cheeses collection
    const cheeses = cheeseRes.data;

    const categoriesRes = // TODO: implement a request to the categories collection
    const categories = categoriesRes.data;

    this.setState({ cheeses, categories });
  }

  addToCheeses = cheese =>
    this.setState(state => {
      const { cheeses } = state;
      // TODO: return the new state that merges the cheeses list with the new cheese
    });

  deleteCheese = async cheeseID => {
    const res = // TODO: implement a request to the correct endpoint to delete the cheese (be mindful of the HTTP method you need)

    // if the DELETE request was unsuccessful exit early
    if (res.status !== 200) { // <-- normally success DELETE is status 204
      return;
    }

    // otherwise update state by removing the cheese
    this.setState(state => {
      const cheeses = state.cheeses.filter(cheese => cheese.id !== cheeseID);
      return { cheeses };
    });
  };

  getCategoryCheeses = async categoryChangeEvent => {
    // extract the chosen option value from the event object
    const selectedCategoryID = categoryChangeEvent.target.value;

    // exit early if the same category ID is chosen
    if (selectedCategoryID === this.state.selectedCategoryID) return;

    // selects the "all cheeses" or "cheeses by category" endpoint depending on the category ID
    const endpoint = selectedCategoryID === "" ? "/cheeses" : `/cheeses/category/${selectedCategoryID}`;

    const res = // TODO: fetch the cheeses using the endpoint
    const cheeses = res.data;

    // updates state with the new selectedCategoryID and cheeses list
    this.setState({ selectedCategoryID, cheeses });
  };

  render() {
    const { cheeses, categories, selectedCategoryID } = this.state;

    return (
      <Container>
        <Row>
					<Col lg={{ span: 8, offset: 2 }}>
            <CheeseForm
              // TODO: complete the props
            />
					</Col>
				</Row>
				<hr />
        <Row className="text-center">
          <Col xs={12} md={8} lg={4}>
            <h5>Cheeses by Category</h5>
            <CheeseCategorySelector
              {/* TODO: complete the props for this component */}
            />
          </Col>
        </Row>
        <CheesesList
          {/* TODO: complete the props for this component */}
          // only show [remove] button if in 'All' category (selectedCategoryID is an empty string)
          removeCheese={selectedCategoryID === "" && this.deleteCheese}
        />
      </Container>
    );
  }
}

export default CheesesView;
```

### Conditional Props

You may be confused by this line:

```js
removeCheese={selectedCategoryID === "" && this.deleteCheese}
```

This technique, [called the short circuit evaluation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators#Short-circuit_evaluation), is often used in React projects because of its simplicity and ability to be used in expression blocks. [The official React docs refer to it as the in-line if](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator)

Remember that `{}` expresion blocks in JSX may only contain expressions. You can't use `if/else if/else` blocks in them! When you need to perform boolean logic you may use the [conditional operator (ternary expression)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) to evaluate if / else scenarios. But the short circuit evaluation is even simpler to use, even if its name sounds complicated!

The name itself, short circuit evaluation, describes exactly what the expression does. When evaluated it will either:

- "short circuit" by returning the first value
  - if the first value / expression (what is on the left) evaluates to a falsy value
  - falsy values are `false` and other values that JavaScript considers "false-like"
    - [full list of falsy values](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)
- "complete the circuit" by returning the last value
  - if the first value / expression evaluates to a truthy value
  - truthy values are `true` and other values JavaScript considers "true-like"
    - [full list of truthy values](https://developer.mozilla.org/en-US/docs/Glossary/truthy)

In our case:

- the first value will be what is returned from evaluating the expression `selectedCategoryID === ""`
  - `true`: if the category is "all cheeses" then the selectedCategoryID is an empty `""`
  - `false`: if the category is a specific category then the selectedCategoryID will be a positive number not an empty string
- the second value is the `deleteCheese` method

So our behavior will be:

- if we are in a specific category then
  - the `cheeseID` field is not an empty string
  - the expression "short circuits" and returns the first value, `false`
  - our `<CheeseList>` component
    - will receive `false` in its `removeCheese` handler prop
    - will not render the remove button next to each cheese
- if we are in the "all cheeses" category then
  - the `cheeseID` field is an empty string
  - the expression "completes the circuit" and returns the second value, the `deleteCheese` method
  - our `<CheesesList>` component
    - receives the `deleteCheese` method in its `removeCheese` handler prop
    - will render a remove button next to each cheese

To further wrap your head around how it works open up `node` in your terminal and try pasting in some of these examples:

```js
// if the value on the left is true (or a truthy value)
// the circuit is completed
// the value on the right will be returned after evaluation
true && "i got returned from the evaluation";
// "i got returned from the evaluation" is returned

// if first value is false (or a falsy value)
// the circuit is short circuited
// the first value will be returned after evaluation
false && "i did not get returned from the evaluation";
// false is returned
```

You can simulate our example in `node` with the following code

```js
selectedCategoryID = "";
selectedCategoryID === "" && "the handler method was provided";

// categoryID is not an empty string: returns false
// categoryID is an empty string: returns 'the handler method was provided'
```

## Child Component Dependencies

Let's evaluate the dependency chain across the Child components we need to implement:

- `<CheesesList>`
  - depends on the `<CheeseForm>` that creates cheeses to display them in the table
    - indirectly depends on the `<CheeseCategorySelector>`
- `<CheeseForm>`
  - depends on the `<CheeseCategorySelector>` since each cheese will need to have a category chosen before submitting
- `<CheeseCategorySelector>`
  - no dependencies

Given this order in the component dependency chain we can implement them in the following order:

- `<CheeseCategorySelector>`
- `<CheeseForm>`
- `<CheesesList>`

Note that this is a "dependency-first" approach to declarative cycling. You may find that an "known-first" approach is more fitting to your development flow. The dependency first approach is a single pass which ends with all the pieces being completed and usable. In the known-first case you would implement the components you understand first, shelling out the parts that don't exist yet, then looping back around to implement those shelled pieces:

- `<CheesesList>` (simple rendering)
- `<CheeseCategorySelector>` (simple rendering and reporting)
- `<CheeseForm>` (complex, form validation, AJAX requests, etc.)

## The `<CheeseCategorySelector>` Component

The Cheese Category Selector component is actually pretty simple because its purpose is just rendering and reporting. What we mean by this is that it will render a select menu and report the chosen result to the Parent component that rendered it.

What's "complex" is that this component will be our first dynamic component. It needs to be used by two Parent components that have very different behaviors - one of which we haven't even created yet! Let's explore the two uses cases.

The `<CheesesView>` component uses it to trigger a request for cheeses whenever a new category is chosen. It passes `"All Cheeses"` for the `firstOption` prop so that the first option in the select menu satisfies its use case of fetching all the cheeses.

Although it hasn't been implemented yet, we can expect the`<CheeseForm>` component to use it for updating the form `categoryID` state field of the cheese that is being created. It should pass `"Select a Category"` as its `firstOption` prop to enforce the user selecting a category before submitting the form.

What both of these Parent components have in common is that they hold the `categoryID` in their own state and update that state field by handling the `onChange` event when the select menu is used. Because they each have different ways of handling this event we chose to name the props more generically as `handleChange` and `categoryID`.

Because of this generic naming the way the props are used make sense both to the Parent component passing them and the `<CheeseCategorySelector>` that uses them. If it was confusing you, this also explains why the prop names themselves are generic but the names of the state fields and methods that each Parent assigns to them are specific to their use case.

The Cheese Selector component is responsible for:

- rendering a select menu with the list of categories
- creating options for the menu using the `firstOption` and list of categories
- handling the `onChange` event of the select element by calling its `handleChange` prop handler method
- should have minimal positional style components around it since it will be used in different components
  - for multi-use components we defer the positional styling to the Parent component that renders it

Since this component is only responsible for rendering and reporting (through its prop handler method) we can create it as a functional component:

- props
  - `firstOption`: (optional) the user facing text for the first option in the menu
  - `categories`: an array of category objects to create select options
  - 2-way binding with the Parent component
    - since our component is used by multiple
    - `handleChange`: the handler prop method provided by the Parent
    - `categoryID`: from the Parent which controls option is considered "selected"
- utility functions
  - `createCategoryOption`: transforms a category into a JSX select option
- rendering
  - a `<Form.Control>` component used as a `<select>` element
  - adding a first option element - its value should be an empty string (indicating it is an "empty" option) - its inner text (user facing) should use the `firstOption` data prop
  - iterating over the categories list and transforming it into select options

Your tasks

- copy the starter code to its file
- complete the TODOs in the snippet

`src/components/cheese/CheeseCategorySelector`

```js
import React from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";

import { categoryType } from "../../utilities/prop-types";

export const createCategoryOption = category => (
  // TODO: return a JSX option using the category id and name
);

const CheeseCategorySelector = props => {
  const { categoryID, categories, firstOption, handleChange } = props;

  return (
    <Form.Control
      as="select"
      name="categoryID"
      value={categoryID}
      onChange={handleChange}
    >
      {/* TODO: implement the first option */}
      {/* TODO: transform the categories into options */}
    </Form.Control>
  );
};

CheeseCategorySelector.propTypes = {
  // TODO: implement the prop types
};

CheeseCategorySelector.defaultProps = {
  // makes the firstOption prop optional
  firstOption: "Select a Category",
};

export default CheeseCategorySelector;
```

Now that our dynamic component is complete let's create the other Parent component that uses it, the `<CheeseForm>`.

## The `<CheeseForm>` Component

The Cheese Form component is responsible for:

- rendering a form for creating a new cheese
- controlling the submission of the form by validating user inputs
- submitting the form data in an API request
- upating the `<CheesesView>` Parent component with new cheese data

This component, like every form component in React, requires a sense of state to manage form data. Let's explore the **Declaration** step of the cycle:

- state
  - `disabled`: controls whether the submit button can be used
    - initial value `true` so the form can't be submitted when empty
  - `fields`: an object that holds each of the form input values
    - since our form has multiple inputs we bundle them into an object to make form submission easier
    - all fields will have an initial empty string `""` value
    - `name`: cheese name
    - `description`: cheese description
    - `categoryID`: cheese category ID
- props
  - `categories` list for the `<CheeseCategorySelector>`
  - `addCheese` handler for providing the `<CheesesView>` with the new cheese
- utility functions
  - `shouldDisable`: receives the form data and returns the new value for `disabled`
    - used every time an input value is changed to ensure all values are valid before enabling submission
- rendering
  - `<Form>`: container for holding input elements
  - input components
    - all will receive the following attribute props
    - all will receive the following event props
    - a text input for the `description` field
      - attribute props
        - `name` the name of the input field
        - `value` for 2-way binding with the form state
      - event props
        - `onChange` for managing 2-way binding with the form state
    - a text input for the `name` field
      - attribute props
        - `name` the name of the input field
        - `value` for 2-way binding with the form state
        - `minLength` for providing validation cues
        - `maxLength` for providing validation cues
      - event props
        - `onChange` for managing 2-way binding with the form state
  - the `<CheeseCategorySelector>` component
    - data props
      - `categories` list
      - `categoryID` for 2-way binding with the form state
    - handler props
      - `handleChange` for 2-way binding with the form state
  - a submit button
    - attribute props
      - `disabled` for controlling whether the form is allowed to be submitted
    - event props
      - `onClick` for submitting the form

### Multi-Input Forms & Validation

Before we dive into implementing this component let's explore how to manage a form with multiple inputs. The first form component we implemented in `<CategoryForm>` was a simple one with a single `name` text input. Managing this form was easy since updating state when the input changed only relied on detecting and validating that single input.

The Cheese Form, however, has to manage 3 different inputs. Two text inputs for `name` and `description` along with using our dynamic `<CheeseCategorySelector>` for the `categoryID` field. As you continue developing React applications you will find that most of the forms you develop will have to manage multiple inputs as well. Yes, managing several inputs is more complex. But thankfully there is a systematic process that can scale from managing 2 to a million fields the exact same way.

You likely noticed how instead of holding the form fields directly in state we store them as nested properties in an object called `fields`. This helps us organize the inputs in a single location so that updating, validating, and submitting them is easier. Because all of the fields in this object can be identified by their name (the name given to their corresponding input element) we can design some dynamic handlers for each of these form management tasks.

First let's tackle the dynamic input change event handler. This is the core method that both validation and submission rely on. Recall that event handlers receive `event` objects that have a `target` object property. This `event.target` object holds data about the input element that was changed. In particular it holds the two properties of information we're after - the `name` and `value` of the input.

We know that our goal is to update state for the input's new `value`. We know that the changed input can be identified in the `fields` state object by its `name`. So what we want to do is set state by merging the current `fields` from state with the new input value to keep them all up to date.

### Setting State Using Current State

Recall that component state can not be mutated directly, instead we use `this.setState()` method. If you are setting state without using the current state you can simply pass an object with the new state or specific fields you want to update. React will only change the fields provided in the object, leaving any other state fields as they were.

```js
// not using current state to set new state
this.setState({ field: value });

// example from below, updating state does not use current state
resetForm = () => this.setState(initialState);
```

However, if you are using data from the current state when setting a new state you must use a callback inside `setState()` instead of an object. The callback receives current state and props as arguments should return the new state as an object.

```js
this.setState((currentState, currentProps) => {
  // derive new state using currentState / currentProps
  // return an object with the updated state
});

// most of the time you just need current state
this.setState(currentState => {
  // derive and return new state
});
```

The reason for this is that component state is set asychronously. React's uses an efficient rendering approach that will batch state updates and execute them at the most efficient time. When state is actually set may not be when you expect. Because this process occurs asynchronously we can not rely on the current value of state (or props) from `this.state/.props` as it may be "out of sync" by the time `setState()` is processed. You can read more about the React reasoning from one of the most well known React developers [@gaearon](https://github.com/facebook/react/issues/11527#issuecomment-360199710).

```js
// DON'T DO THIS!
updateUsingState = () => {
  // using the current value from state outside of this.setState()

  // using "fieldName" with some other data to derive new state
  const fieldName = this.state.fieldName + otherData;

  // this.state may be different by the time setState is processed
  this.setState({ fieldName });
};

// DO THIS INSTEAD
updateUsingState = () => {
  this.setState(currentState => {
    // currentState will be the correct (current) state relative to this update
    const fieldName = currentState + otherData;
    return { fieldName };
  });
};
```

Why is this important? Because our goal for handling input changes is to merge the current `fields` data in state with a new input value. To accomplish this we need to use the callback approach to `setState()`.

### Multi-Input Form Change Handling

So what should our `handleInputChange` method look like? Let's begin with what we know:

```js
handleInputChange = event => {
  // we need the name and value from the input, the event target
  const { name, value } = event.target;

  // we need to set state by using current state so we use the setState callback
  this.setState(currentState => {
    // we current state fields to merge with the new value
    const { fields } = currentState;

    // we need to copy current fields into a new object so as not to directly mutate it
    // we can use the spread operator as a shorthand since all the field properties are primitives
    const updatedFields = { ...fields };

    // ? update the value in fields for the current input's name

    // return the updated state of fields
    return { fields: updatedFields };
  });
};
```

Now comes the dynamic part of our handler. We want to perform the same behavior regardless of which input we receive in the change event target. This way we can write one handler that all of our inputs can assign to the `onChange` event prop.

Recall that you can access and set object properties with a variable using the bracket notation:

```js
const object = { property: "original value" };
const propertyName = "property";

object[propertyName]; // 'original value'
object[propertyName] = "new value";
object[propertyName]; // 'new value'
```

Our `name` from the input target is a variable - it will vary depending on which input was changed. We can use the bracket notation to update the value dynamically!

```js
handleInputChange = event => {
  // we need the name and value from the input, the event target
  const { name, value } = event.target;

  // we need to set state by using current state so we use the setState callback
  this.setState(currentState => {
    // we current state fields to merge with the new value
    const { fields } = currentState;

    // we need to copy current fields into a new object
    // it is a best practice to never mutate function arguments (currentState) directly
    // we can use the spread operator as a shorthand since all the field properties are primitives
    const updatedFields = { ...fields };

    // set the new value dynamically using the name variable
    updatedFields[name] = value;

    // return the updated state of fields
    return { fields: updatedFields };
  });
};
```

Now our `handleInputChange` can handle input changes from 1 to a million inputs the same way! As a bonus take a look at the shorthand way of writing this handler, feel free to use whichever approach makes sense to you.

```js
handleInputChange = event => {
  const { name, value } = event.target;

  this.setState(currentState => {
    const fields = { ...currentState.fields, [name]: value };
    // same as
    // const fields = { ...currentState.fields };
    // fields[name] = value;

    // if you are setting a property in an object with the same name
    // you do not need to write { fields: fields }, thanks ES6!
    return { fields };
  });
};

// or if you really want to push it by sacrificing readability
handleInputChange = ({ target: { name, value } }) =>
  this.setState(state => ({ fields: { ...state.fields, [name]: value } }));
```

### Multi-Input Form Validation

Now that we have completed the dynamic input change handler it's time to think about validation of the field values. Form validation can be done in a variety of different ways from custom implementations to using third party libraries. Before getting lost in the process remember to keep your end goal in mind.

We have a field in state called `disabled` that controls whether the submit button can be clicked. We have fields with values that we want to validate. Our end goal is to check the fields, according to the input requirements, and determine a boolean value for `disabled` to be set to. We will cover one approach here but remember as long as the end goal is met and the code is readable feel free to implement validation any way you would like.

First let's analyze our validation requirements. The cheese `name` must be between 3 and 15 characters. The cheese `description` and `categoryID` must not be empty strings. Recall that `<CheeseCategorySelector>` provides a first option with an empty string as a value - an invalid option that is used aesthetically to show some first option text to the user. So we can see that the `description` and `categoryID` are valid as long as they are not empty strings.

Next let's consider how we will implement validation. We need to validate all the fields whenever an input changes. Why all the fields? Because if we change `disabled` to `false` based on the valid value of a single input then we may let other invalid inputs slip through. There, you've just been spared several hours of debugging!

Since we have to validate all the fields we will need to iterate over them. We can use `Object.values/keys/entries` to loop over an object. In this case we need both the `name` and `value` of the field to differentiate which validation rule we are checking. Since we need both the key and the value of each property we should use `Object.entries()`. We will be performing this behavior many times so we should create a function which receives a fields object and returns a boolean that `disabled` can be set to.

We will use the "flag and loop" approach for this function. Our flag will be the value we want to return, `disabled`. We will initialize it as `false` and control its value within the validation loop. If one or more field validations fail we set the flag to `true` to indicate that the form should be disabled. If the validations all pass then the flag will never be changed from `false` indicating that our form is ready to submit.

```js
const shouldDisable = fields => {
  // disabled flag, notice we use "let"
  // this is to allow the variable to be re-assigned in the loop
  let disabled = false;

  for (const [fieldName, value] of Object.entries(fields)) {
    // validate the value according to the field name
  }

  return disabled;
};

// if the in-line array destructuring confuses you remember it is the same as
for (const entry of Object.entries(fields)) {
  // array destructuring or "unpacking"
  const [fieldName, value] = entry;

  // or more imperatively
  const fieldName = entry[0];
  const value = entry[1];
}
```

Within the loop there are many ways of performing validations. Since we only have two validation options (character limits and non-empty string) we can write this logic in the loop itself. Preferably this should be moved to its own function for a more declarative style. Especially if we had more fields or validation options.

Notice that we provide no mechanism for the `disabled` flag to ever be set `false` again within the loop. This is to ensure we do not ever get a `false` positive, damn that was a fitting pun.

```js
const shouldDisable = fields => {
  // disabled flag, notice we use "let"
  // this is to allow the variable to be re-assigned in the loop
  let disabled = false;

  for (const [fieldName, value] of Object.entries(fields)) {
    if (fieldName === "name") {
      // name field less than 3 or greater than 15 characters should disable
      if (value.length < 3 || value.length > 15) {
        disabled = true;
      }
      // other fields that are empty strings should disable
    } else if (value === "") {
      disabled = true;
    }
  }

  return disabled;
};
```

This looks pretty hairy. Let's see how it could be rewritten using a `switch` statement:

```js
const shouldDisable = fields => {
  let disabled = false;

  for (const [fieldName, value] of Object.entries(fields)) {
    switch (fieldName) {
      case "name":
        if (value.length < 3 || value.length > 15) {
          disabled = true;
        }
        break;
      // these fields fall through but should be added for readability and extendability
      case "description":
      case "categoryID":
      default:
        if (value === "") {
          disabled = true;
        }
    }
  }

  return disabled;
};

// or more declaratively using a validator function

const shouldDisable = fields => {
  let disabled = false;

  for (const [fieldName, value] of Object.entries(fields)) {
    if (isFieldInvalid(fieldName, value)) {
      disabled = true;
    }
  }

  return disabled;
};

const isFieldInvalid = (fieldName, value) => {
  // we can utilize the "return" exit strategy of a function
  // this leads to cleaner looking code
  switch (fieldName) {
    case "name":
      return value.length < 3 || value.length > 15;
    case "description":
    case "categoryID":
    default:
      return value === "";
  }
};
```

The `switch` statement gives us greater flexibility. For now we set `description` and `categoryID` to "fall through" to the default case which checks if the value is an empty string. In the future if we wanted more specific validation for these fields we could simply add them to their respective cases. And if our form introduces new fields we can add more cases to handle them.

### Implementation

Now that the `shouldDisable` utility function has been implemented you need to consider how it will be used. We know it needs to be called every time an input changes so it should go in the `handleInputChange` method. Remember that `shouldDisable` will return the value that the state `disabled` field should be updated to. Keep that in mind as you work on the starter code for this section:

- copy the starter code to its file
- complete the TODOs in the snippet

`src/components/cheese/CheeseForm`

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import request from '../../utilities/api-request';
import { categoryType } from '../../utilities/prop-types';
import CheeseCategorySelector from "./CheeseCategorySelector";

const shouldDisable = formFields => {
  // TODO: implement the utility
}

// we write the initial state object externally
// this way we can use it both to set initial state and when resetting the form
// single source of truth, DRY principles!
const initialState = {
  // TODO: implement initial state
}

class CheeseForm extends Component {
  state = initialState;

  // resets the form by setting state back to the initial state
  resetForm = () => this.setState(initialState);

  handleInputChange = event => {
    const { name, value } = event.target;

    this.setState(currentState => {
      // TODO: implement the rest of the change handler

      return { fields, disabled };
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { fields } = this.state;
    const { addCheese } = this.props;

    // TODO: submit the form with a request to the API
    const res = // use the correct request method, endpoint, and data
    const cheese = res.data;

    // TODO: report the new cheese data to the <CheesesView> Parent
    this.resetForm();
  }

  render() {
    const { categories } = this.props;
    const { disabled, fields: { name, description, categoryID } } = this.state;

    return (
      <Form className="text-center">
        <h2>Create a Cheese</h2>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Cheese Name</Form.Label>
            <Form.Control
              name='name'
              value={name}
              minLength={3}
              maxLength={15}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Cheese Category</Form.Label>
            {/* TODO: render the <CheeseCategorySelector> with appropriate props */}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Cheese Description</Form.Label>
            <Form.Control
              required
              name='description'
              value={description}
              onChange={this.handleInputChange}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Col>
            <Button
              type='submit'
              variant='primary'
              disabled={disabled}
              onClick={this.handleSubmit}
            >
              Create Cheese
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }
}

CheeseForm.propTypes = {
  // TODO: implement the prop types
};

export default CheeseForm;
```

## The `<CheesesList>` Component

The final Cheese component we will create is the Cheeses List. This component is also used by two Parent components like the `<CheeseCategorySelector>` component. Recall that earlier we provided a conditional prop `removeCheese` when rendering the Cheeses List in the `<CheesesView>` Parent component.

We will provide the same prop but with a slightly different behavior when we create the Menu Cheeses component in the next section. Both of these Parent components will have handler for removing a cheese. For the Cheeses View removing a cheese meant requesting a `DELETE` operation from `/cheeses`. For the Menu Cheeses we will make a `DELETE` request to the `cheeses` sub-collection of a menu at the `/menus/:menuID/cheeses/:cheeseID` endpoint.

From the perspective of the Cheeses List component all it cares about is a cheeses list and an optional handler prop method. The source of the cheeses and the behavior of what that method does in the Parent are not of its concern.

Before we get into implementing this component let's explore some new information that we will need. The concept of conditional rendering.

### Conditional Rendering

Conditional rendering is an approach used to make React components more dynamic. As we know, in React whatever is returned from a functional component or from the `render()` method of a stateful component is rendered. We can use this knowledge to design components that render differently according to the context.

One thing you may not have known is what happens when React receives a falsy (`false`, `null`, `undefined`, etc.) value. The falsy value can occur either by directly returning (from the function or `render()` method) but also within a JSX expression block. When React receives a falsy value in either of these locations it thinks of this as a "do not render" instruction.

Let's explore what happens when a JSX expression `{}` block has a falsy value in it. This knowledge is more immediately useful for us right now. Later, in the Menus View section, we will explore conditional rendering from function / `render()` returns.

### Conditional JSX Rendering

Remember the short circuit expression from earlier in this guide? We used it for providing conditional props to this very component:

```js
<CheesesList
  cheeses={cheeses}
  removeCheese={selectedCategoryID === "" && this.deleteCheese}
/>
```

This allowed us to conditionally provide the `deleteCheese` handler method as a prop when it was appropriate. We will use the same short circuit expression to conditionally render a remove button within our `<Table>`.

If the expression "short circuits" then a falsy value is returned from it. And since React reads falsy values as "don't render this" we can ensure that the remove button is only rendered when we "complete the circuit". Here is the implemented example that controls the rendering of the table column that will hold the remove button. Take note of how it works so that you can implement conditional rendering of the button itself in a similar way:

```js
...
const { removeCheese, cheeses } = this.props;
...
<Table responsive striped bordered size='lg'>
  <thead>
    <tr>
      {/* only render blank column if [remove] button should render */}
      {removeCheese && <th style={{ border: 'none' }}></th>}
      <th>Name</th>
      <th>Category</th>
      <th>Description</th>
    </tr>
  </thead>
  ...
</Table>
```

So how will this JSX expression block be evaluated? If the `removeCheese` handler prop is provided as a function then we should render the remove column and button to use it. Recall that functions are truthy values so its presence will cause the expression to "complete the circuit" and return the blank column `<th style={{ border: 'none' }}></th>` on the right.

If the `removeCheese` prop is provided as `false` (from short circuiting in the conditional prop expression of the Parent) then the JSX expression block will also short circuit. This means the expression will return `false` (the value of `removeCheese`). React will see `{false}` in the JSX and determine that this block should not be rendered.

If you are interested in learning about a more advanced topic in conditional Component rendering read the next section. If not scroll past it and get to implementing the `<CheesesList>` with your newfound knowledge!

### Conditional Component Rendering

Conditional rendering outside of JSX blocks is a useful pattern to learn in React. With this approach we can make more dynamic components that render according to information from their props or state. We will explore one common scenario with network requests below. Note that this pattern can be applied to any component that should behave dynamically with respect to its rendering behavior.

Say you have a component that has to fetch data that may take some time to return. To provide a better user experience you can conditionally render different components depending on the status of the request:

- if you are waiting on the response you render a Loading component that let's the user know the component is processing and not frozen
- if you receive an error during the request you render an Error component to let them know
- finally if you are not loading and have received the data you can render the components that rely on that data

```js
...

class MyComponent extends Component {
  state = {
    data: null,
    error: null,
    loading: true,
  }

  componentDidMount() {
    // loading flag is set to true at this point (initial state)
    fetchData()
      .then(handleData) // if the data is received succesfully
      .catch(handleError); // if an error is encountered during the request
  }

  // if an error is received set it in state and flip the loading flag
  handleError = error => this.setState({ error, loading: false });

  // when the data is received set it in state and flip the loading flag
  handleData = data => this.setState({ data, loading: false });

  render() {
    const { data, error, loading } = this.state;

    // if we are loading then return (render) the Loading component
    if (loading) return <Loading />;

    // if we received an error then render an Error component
    if (error) return <Error />

    // if we are neither loading nor have encountered an error
    // then our data is ready and we can render components that rely on the data
    return (
      <ComponentThatNeedsData data={data} />
    );
  }
}

...
```

In fact this is a very common pattern in React. Because this logic is often repeated across many components you may be wondering how it can be abstracted to prevent code repetition. To improve code reusability you can design a "higher order" component that uses a technique called [render props](https://reactjs.org/docs/render-props.html), the same technique used by React Router!

A higher order component is just like a higher order function (that we use in Array methods). But instead of receiving a function argument they receive a function / component prop.

You often see custom implementations of this technique for handling network requests. You can think of this as a utility wrapper component. It "wraps" another component to handle request processing then returns that child component, giving it the data as props, if the processing succeeds. Otherwise it handles loading and error states so that the Child component doesn't have to re-implement that logic.

With this pattern we are able to turn would-be stateful components into functional ones. Since all they care about is the end data we can have our wrapper component manage the request process with conditional rendering.

```js
class RequestWrapper extends Component {
  state = {
    data: null,
    error: null,
    loading: true,
  }

  componentDidMount() {
    fetchData()
      .then(handleData)
      .catch(handleError);
  }

  handleData = data => this.setState({ data, loading: false });
  handleError = error => this.setState({ error, loading: false });

  render() {
    const { showLoading, Component } = this.props;
    const { data, error, loading } = this.state;

    // if the showLoading prop is passed render the Loading component
    // otherwise return null meaning "dont render anything"
    if (loading) return showLoading ? <Loading /> : null;

    // if we received an error then render an Error component
    if (error) return <Error />

    // if we have the data then render the "wrapped" component giving it the data
    return <Component data={data} />;
  }
}

// and its usage

// a functional component since it does not have to manage request processing state
const WrappedComponent = (props) => {
  const { data } = props;

  // data and error handlers do not need to be re-implemented

  // no need to re-implement the if(loading) / if (error) business

  return (
    // all we need is the data to use here
  )
}

// we export WrappedComponent as the Component prop of the RequestWrapper
// during the request the RequestWrapper will render Loading / Error components as needed
// when the data is received it will render its Component prop (WrappedComponent) with the data
export default <RequestWrapper showLoading Component={WrappedComponent} />;

// now when this WrappedComponent is rendered it will (indirectly) handle loading, error, and data rendering for us!
```

### Implementation

The responsibilities of the Cheese List are:

- render a table of cheeses
- conditionally render a remove button
- report the selected cheese if the remove button is clicked

We can see that this component is only responsible for rendering and reporting. It does not need any state so we can design it as a stateless functional component:

- props
  - `cheeses` list
  - `removeCheese` handler prop
    - can be `false` OR a function
    - think about how you can implement this prop type
- utility function
  - `createCheeseRow`: receives a `cheese` and `removeCheese` handler
    - creates a cheese data row
    - conditionally renders a remove button
      - renders if the `removeCheese` handler prop is provided as a function
- rendering
  - `<Table>` container for the `cheeses` data
  - cheese data rows
  - conditional rendering of a column for the remove buttons
    - renders if the `removeCheese` handler prop is provided as a function

Your tasks

- copy the starter code to its file
- complete the TODOs in the snippet

```js
import React from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

// TODO: if you have not created the cheese and menu types yet
import { cheeseType } from '../../utilities/prop-types';

const createCheeseRow = (cheese, removeCheese) => (
    <tr key={cheese.id}>
      {
        // TODO: conditionally render the remove button in the ( ) below
        (
          <td style={{ width: '32px', border: 'none' }}>
            <Button
              size='sm'
              variant='outline-danger'
              onClick={/* TODO: give removeCheese the cheese ID */}
            >
              remove
            </Button>
          </td>
        )
      }
      {/* TODO: implement the columns for the cheese name, description, and cheese.category.name */}
    </tr>
)

const CheesesList = (props) => {
  const { cheeses, removeCheese } = props;

  return (
    <Container>
      <h3 className='text-center'>Cheeses</h3>
      <Table responsive striped bordered size='lg'>
        <thead>
          <tr>
            {/* only render blank column if [remove] button should render */}
            {removeCheese && <th style={{ border: 'none' }}></th>}
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {/*
            TODO: create the cheese rows
            be careful here, your callback createCheeseRow needs 2 arguments
              the cheese element and the removeCheese prop
          */}
        </tbody>
      </Table>
    </Container>
  );
};

CheesesList.propTypes = {
  // TODO: implement the prop types

  // removeCheese can be one of two types (boolean or function)
  // play the dot game on PropTypes to see how to implement this
};

export default CheesesList;
```

# Section Complete

Congratulations making it so far. You should now have a fully functional app with the ability to create and view categories as well as creating, viewing, and removing cheeses. Run your app and test everything out before continuing to the [next section](./4-menus-view.md).
