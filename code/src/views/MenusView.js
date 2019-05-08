import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import request from "../utilities/api-request";
import MenusList from "../components/menu/MenusList";
import MenuForm from "../components/menu/MenuForm";

class MenusView extends Component {
	state = {
		menus: [],
	};

	async componentDidMount() {
		const res = await request.get("/menus");
		const menus = res.data;
		this.setState({ menus });
	}

	addToMenus = newMenu =>
		this.setState(state => {
			const { menus } = state;
			return { menus: [newMenu, ...menus] };
		});

	render() {
		const { menus, showForm } = this.state;

		return (
			<Container>
				<Row>
					<Col>
						<MenuForm addMenu={this.addToMenus} />
					</Col>
				</Row>
				<hr />
				<Row>
					<Col>
						<MenusList menus={menus} />
					</Col>
				</Row>
			</Container>
		);
	}
}

export default MenusView;
