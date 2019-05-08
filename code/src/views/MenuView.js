import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import request from "../utilities/api-request";
import Loading from "../components/Loading";
import CheesesList from "../components/cheese/CheesesList";
import AddMenuCheeseForm from "../components/menu/AddMenuCheeseForm";

class MenuView extends Component {
	state = {
		menu: null,
	};

	async componentDidMount() {
		// get the menuID from the matched path
		const { menuID } = this.props.match.params;

		// TODO: request the menu for the given menuID
		// check the API reference for the correct endpoint to use
		const res = await request.get(`/menus/${menuID}`);
		const menu = res.data; // if no menu is found will be an empty string ""

    this.setState({ menu });
	}

	addToCheeses = cheese =>
		this.setState(state => {
			const { menu } = state;

			const cheeses = [cheese, ...menu.cheeses];

			return { menu: { ...menu, cheeses } };
		});

	removeFromCheeses = cheeseID =>
		this.setState(state => {
			const { menu } = state;

			// TODO: provide the filter() callback
			// should return true for any cheese whos ID DOES NOT match the cheeseID
			const cheeses = menu.cheeses.filter(cheese => cheese.id !== cheeseID);

			return { menu: { ...menu, cheeses } };
		});

	deleteCheese = async cheeseID => {
		const { menu } = this.state;
		// TODO: make an API request to remove the cheese from the menu
		// check the API reference for the correct endpoint
		const res = await request.delete(`/menus/${menu.id}/cheeses/${cheeseID}`);

		// if the request failed exit early
		if (res.status !== 201) {
			return;
		}

		this.removeFromCheeses(cheeseID);
	};

	render() {
		const { menu } = this.state;

		// if menu is our initial value, null, we are still loading
		if (menu === null) return <Loading />;

		// if the response did not find a menu with the given ID it will be ""
		// redirect to the MenusView at /menus
		if (menu === "") return <Redirect to="/menus" />;

		// otherwise we render our MenuView
		return (
			<Container>
				<h2 className="text-center">{menu.name}</h2>
				<Row>
					<Col>
						<AddMenuCheeseForm
							menuID={menu.id}
							currentCheeses={menu.cheeses}
							addCheese={this.addToCheeses}
						/>
					</Col>
				</Row>
				<hr />
				<Row>
					<Col>
						<CheesesList
							cheeses={menu.cheeses}
							removeCheese={this.deleteCheese}
						/>
					</Col>
				</Row>
			</Container>
		);
	}
}

MenuView.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			menuID: PropTypes.string.isRequired,
		}),
	}),
};

export default MenuView;
