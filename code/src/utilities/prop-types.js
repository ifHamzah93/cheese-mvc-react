import PropTypes from 'prop-types';

const categoryEntity = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const cheeseEntity = {
  ...categoryEntity,
  description: PropTypes.string.isRequired,
  category: PropTypes.shape(categoryEntity),
};

const menuEntity = {
  ...categoryEntity,
}

export const categoryType = PropTypes.shape(categoryEntity);
export const cheeseType = PropTypes.shape(cheeseEntity);
export const menuType = PropTypes.shape(menuEntity);