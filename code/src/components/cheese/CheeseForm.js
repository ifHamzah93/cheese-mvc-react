import React, { Component } from "react";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import request from "../../utilities/api-request";
import { categoryType } from "../../utilities/prop-types";
import CheeseCategorySelector from "./CheeseCategorySelector";

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

// we write the initial state object externally
// this way we can use it both to set initial state and when resetting the form
// single source of truth, DRY principles!
const initialState = {
	disabled: true,
	fields: {
		name: "",
		categoryID: "",
		description: "",
	},
};

class CheeseForm extends Component {
	state = initialState;

	resetForm = () => this.setState(initialState);

	handleInputChange = event => {
		const { name, value } = event.target;

		this.setState(currentState => {
			const fields = { ...currentState.fields, [name]: value };
			const disabled = shouldDisable(fields);

			return { fields, disabled };
		});
	};

	handleSubmit = async event => {
		event.preventDefault();
		const { fields } = this.state;
		const { addCheese } = this.props;

		const res = await request.post("/cheeses", fields);
		const cheese = res.data;

		addCheese(cheese);
		this.resetForm();
	};

	render() {
		const { categories } = this.props;
		const {
			disabled,
			fields: { name, description, categoryID },
		} = this.state;

		return (
			<Form className="text-center">
        <h2>Create a Cheese</h2>
				<Form.Row>
					<Form.Group as={Col}>
						<Form.Label>Cheese Name</Form.Label>
						<Form.Control
							name="name"
							value={name}
							minLength={3}
							maxLength={15}
							onChange={this.handleInputChange}
						/>
					</Form.Group>
					<Form.Group as={Col}>
						<Form.Label>Cheese Category</Form.Label>
						<CheeseCategorySelector
							categories={categories}
							categoryID={categoryID}
							handleChange={this.handleInputChange}
						/>
					</Form.Group>
				</Form.Row>

				<Form.Row>
					<Form.Group as={Col}>
						<Form.Label>Cheese Description</Form.Label>
						<Form.Control
							name="description"
							value={description}
							onChange={this.handleInputChange}
						/>
					</Form.Group>
				</Form.Row>

				<Form.Row>
          <Col>
            <Button
              type="submit"
              variant="primary"
              disabled={disabled}
              onClick={this.handleSubmit}
            >
              Create
            </Button>
          </Col>
				</Form.Row>
			</Form>
		);
	}
}

CheeseForm.propTypes = {
	categories: PropTypes.arrayOf(categoryType),
};

export default CheeseForm;
