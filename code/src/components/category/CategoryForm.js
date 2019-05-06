import React, { Component } from "react";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import request from "../../utilities/api-request";

class CategoryForm extends Component {
  state = {
    name: "",
    disabled: true,
  };

  handleInputChange = event => {
    const { value } = event.target;

    const disabled = value.length < 3 || value.length > 15;
    this.setState({ disabled, name: value });
  };

  // sets the value to an empty string to reset the form
  resetForm = () => this.setState({ name: "" });

  handleSubmit = async event => {
    event.preventDefault();
    const { name } = this.state;
    const { addCategory } = this.props;

    const res = await request.post("/categories", { name });
    const category = res.data;

    addCategory(category);
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
              value={name}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          
          <Button
            type="submit"
            variant="primary"
            disabled={disabled}
            onClick={this.handleSubmit}
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
  addCategory: PropTypes.func.isRequired,
};

export default CategoryForm;
