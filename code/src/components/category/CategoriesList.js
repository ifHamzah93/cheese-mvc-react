import React from "react";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";

import { categoryShape } from "../../utilities/prop-types";

const createCategoryRow = category => (
	<tr key={category.id}>
		<td>{category.name}</td>
	</tr>
);

const CategoriesList = props => {
	const { categories } = props;

	return (
		<Container className="text-center">
			<Row>
				<Col>
					<h2 className="text-center">Categories</h2>
				</Col>
			</Row>
			<Row>
				<Col xs={12} lg={{ span: 4, offset: 4 }}>
					<Table size="sm" bordered>
						<thead>
							<tr>
								<th>Name</th>
							</tr>
						</thead>
						<tbody>{categories.map(createCategoryRow)}</tbody>
					</Table>
				</Col>
			</Row>
		</Container>
	);
};

CategoriesList.propTypes = {
  categories: PropTypes.arrayOf(categoryShape).isRequired,
};

export default CategoriesList;
