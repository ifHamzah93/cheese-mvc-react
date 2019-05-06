import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import request from "../utilities/api-request";
import CheeseForm from "../components/cheese/CheeseForm";
import CheesesList from "../components/cheese/CheesesList";
import CheeseCategorySelector from "../components/cheese/CheeseCategorySelector";

class CheesesView extends Component {
	state = {
		cheeses: [],
		categories: [],
		selectedCategoryID: "",
	};

	async componentDidMount() {
		const cheeseRes = await request.get("/cheeses");
		const cheeses = cheeseRes.data;

		const categoriesRes = await request.get("/categories");
		const categories = categoriesRes.data;

		this.setState({ cheeses, categories });
	}

	addToCheeses = cheese =>
		this.setState(state => {
			const { cheeses } = state;
			return { cheeses: [cheese, ...cheeses] };
		});

	deleteCheese = async cheeseID => {
		const res = await request.delete(`/cheeses/${cheeseID}`);

		// if the DELETE request was unsuccessful exit early
		if (res.status !== 204) {
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
		const endpoint =
			selectedCategoryID === ""
				? "/cheeses"
				: `/cheeses/category/${selectedCategoryID}`;

		const res = await request.get(endpoint);
		const cheeses = res.data;

		// updates state with the new categoryID and cheeses list
		this.setState({ selectedCategoryID, cheeses });
	};

	render() {
		const { cheeses, categories, selectedCategoryID } = this.state;

		return (
			<Container>
				<Row>
					<Col lg={{ span: 8, offset: 2 }}>
						<CheeseForm categories={categories} addCheese={this.addToCheeses} />
					</Col>
				</Row>
				<hr />
				<Row className="text-center">
					<Col xs={12} md={8} lg={4}>
						<h5>Cheeses by Category</h5>
						<CheeseCategorySelector
							firstOption="All Cheeses"
							categories={categories}
							categoryID={selectedCategoryID}
							handleChange={this.getCategoryCheeses}
						/>
					</Col>
				</Row>
				<CheesesList
					cheeses={cheeses}
					// only show [remove] button if in 'All' category (selectedCategoryID is an empty string)
					removeCheese={selectedCategoryID === "" && this.deleteCheese}
				/>
			</Container>
		);
	}
}

export default CheesesView;
