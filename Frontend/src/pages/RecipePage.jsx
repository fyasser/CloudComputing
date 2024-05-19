import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const backend_url = "http://localhost:6000/recipes";

const RecipePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(backend_url);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleEdit = (recipe) => {
    setCurrentRecipe(recipe);
    setShowModal(true);
  };

  const handleDelete = async (recipe) => {
    try {
      await axios.delete(`${backend_url}/${recipe.id}`);
      setRecipes((prevRecipes) =>
        prevRecipes.filter((r) => r.id !== recipe.id)
      );
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentRecipe(null);
  };

  const handleSaveRecipe = async () => {
    try {
      const response = await axios.put(`${backend_url}/${currentRecipe.id}`, currentRecipe);
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === currentRecipe.id ? response.data : recipe
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleIngredientsChange = (e) => {
    setCurrentRecipe({ ...currentRecipe, ingredients: e.target.value });
  };

  return (
    <Container>
      <Button variant="info" onClick={() => setShowModal(true)}>Create Recipe</Button>
      <Table striped bordered hover className="my-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Category</th>
            <th>Ingredients</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe, index) => (
            <tr key={recipe.id}>
              <td>{index + 1}</td>
              <td>{recipe.title}</td>
              <td>{recipe.category}</td>
              <td>{recipe.ingredients}</td>
              <td>
                <Button variant="info" onClick={() => handleEdit(recipe)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(recipe)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentRecipe ? 'Edit Recipe' : 'Create Recipe'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" value={currentRecipe ? currentRecipe.title : ''} />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" placeholder="Enter category" value={currentRecipe ? currentRecipe.category : ''} />
            </Form.Group>
            <Form.Group controlId="formIngredients">
              <Form.Label>Ingredients</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter ingredients" value={currentRecipe ? currentRecipe.ingredients : ''} onChange={handleIngredientsChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveRecipe}>Save Recipe</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RecipePage;
