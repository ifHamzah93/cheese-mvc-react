import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import request from "../utilities/api-request";
import CategoryForm from "../components/category/CategoryForm";
import CategoriesList from "../components/category/CategoriesList";

class CategoriesView extends Component {
	state = {
		categories: [],
	};

	async componentDidMount() {
		const res = await request.get("/categories");
    const categories = res.data;

    this.setState({ categories });
	}

	addToCategories = category =>
		this.setState(state => {
			const { categories } = state;

			return { categories: [category, ...categories] };
		});

	render() {
		const { categories } = this.state;

		return (
			<Container>
				<Row>
					<CategoryForm addCategory={this.addToCategories} />
				</Row>
				<br />
				<Row>
					<CategoriesList categories={categories} />
				</Row>
			</Container>
		);
	}
}

export default CategoriesView;
