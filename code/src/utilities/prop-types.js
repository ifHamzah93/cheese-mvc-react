import PropTypes from 'prop-types';

const categoryEntity = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

// a Prop Types definition using the base shape
// exported as a named export to match how we imported it in CategoriesList.js
export const categoryShape = PropTypes.objectOf(categoryEntity);