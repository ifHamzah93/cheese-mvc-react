import React from "react";
import PropTypes from 'prop-types';
import Form from "react-bootstrap/Form";

import { categoryType } from "../../utilities/prop-types";

export const createCategoryOption = category => (
	<option key={category.id} value={category.id}>
		{category.name}
	</option>
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
			<option value="">{firstOption}</option>
			{categories.map(createCategoryOption)}
		</Form.Control>
	);
};

CheeseCategorySelector.propTypes = {
  handleChange: PropTypes.func.isRequired,
	categories: PropTypes.arrayOf(categoryType).isRequired
};

CheeseCategorySelector.defaultProps = {
	// makes the firstOption prop optional
	firstOption: "Select a Category",
};

export default CheeseCategorySelector;
