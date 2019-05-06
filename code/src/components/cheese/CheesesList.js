import React from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { cheeseType } from '../../utilities/prop-types';

const cheeseRow = (cheese, removeCheese) => (
    <tr key={cheese.id}>
      {/* only render [remove] button if handler method is available */}
      {
        removeCheese && (
          <td style={{ width: '32px', border: 'none' }}>
            <Button variant='outline-danger' size='sm'
              onClick={() => removeCheese(cheese.id)}
            >
              remove
            </Button>
          </td>
        )
      }
      <td>{cheese.name}</td>
      <td>{cheese.category.name}</td>
      <td>{cheese.description}</td>
    </tr>
)

const CheesesList = (props) => {
  const { cheeses, removeCheese } = props;

  return (
    <Container>
      <h3 className='text-center'>Cheeses</h3>
      <Table responsive striped bordered size='lg'>
        <thead>
          <tr>
            {/* only render blank column if [remove] button should render */}
            {removeCheese && <th style={{ border: 'none' }}></th>}
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {cheeses.map(cheese => cheeseRow(cheese, removeCheese))}
        </tbody>
      </Table>
    </Container>
  );
};

CheesesList.propTypes = {
  // not passed when displaying cheeses for individual category
  // there is no 'remove cheese from category' endpoint
  removeCheese: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  cheeses: PropTypes.arrayOf(cheeseType).isRequired,
};

export default CheesesList;
