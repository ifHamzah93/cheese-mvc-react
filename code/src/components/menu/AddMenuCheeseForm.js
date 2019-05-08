import React, { Component } from "react";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import request from "../../utilities/api-request";
import { cheeseType } from "../../utilities/prop-types";

// if your face melted trying to understand this look below!
const filterAvailableCheeses = (currentCheeses, allCheeses) =>
	allCheeses.filter(
		availableCheese =>
			!currentCheeses.some(
				currentCheese => currentCheese.id === availableCheese.id,
			),
	);

const createCheeseOption = cheese => (
	<option key={cheese.id} value={cheese.id}>
		{cheese.name}
	</option>
);

const initialState = {
	cheeseID: "",
	allCheeses: [],
};

class AddMenuCheeseForm extends Component {
	state = initialState;

	resetForm = () => this.setState({ cheeseID: "" });

	async componentDidMount() {
		// get the full list of cheeses
		const res = await request.get("/cheeses");
		const allCheeses = res.data;

		this.setState({ allCheeses });
	}

	handleInputChange = event => {
		const { value } = event.target;
		this.setState({ cheeseID: value });
	};

	handleSubmit = async event => {
		event.preventDefault();
		const { menuID, addCheese } = this.props;
		const { allCheeses, cheeseID } = this.state;

		// TODO: make an API request using the correct endpoint and data
		// check the API reference to see how to add a cheese to a menu
		const res = await request.post(`/menus/${menuID}/cheeses`, { cheeseID });

		// if the request failed exit early
		if (res.status !== 201) {
			return;
		}

		// finds the cheese using its ID
		// Number(cheeseID) is to ensure the form's string cheeseID is comparable to the number cheese.id
		const cheese = allCheeses.find(cheese => cheese.id === Number(cheeseID));

		// TODO: give the cheese to the MenuView Parent component
		// TODO: reset the form
		addCheese(cheese);
		this.resetForm();
	};

	render() {
		const { currentCheeses } = this.props;
		const { cheeseID, allCheeses } = this.state;

		const availableCheeses = filterAvailableCheeses(currentCheeses, allCheeses);
		console.log({ allCheeses, currentCheeses, availableCheeses });
		return (
			availableCheeses.length !== 0 && (
				<Container className="text-center">
					<Form>
						<Form.Group as={Col} sm={{ offset: 4, span: 4 }}>
							<Form.Control
								as="select"
								name="cheeseID"
								value={cheeseID}
								onChange={this.handleInputChange}
							>
								<option value="">Select a Cheese</option>
								{availableCheeses.map(createCheeseOption)}
							</Form.Control>
						</Form.Group>
						<Button
							type="submit"
							variant="primary"
							disabled={cheeseID === ""}
							onClick={this.handleSubmit}
						>
							Add Cheese
						</Button>
					</Form>
				</Container>
			)
		);
	}
}

AddMenuCheeseForm.propTypes = {
	addCheese: PropTypes.func.isRequired,
	currentCheeses: PropTypes.arrayOf(cheeseType).isRequired,
};

export default AddMenuCheeseForm;
