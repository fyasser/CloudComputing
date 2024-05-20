import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const backend_url = "http://localhost:3000/recipes"; // Updated port

const RecipePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formIngredients, setFormIngredients] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);
  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/recipes');
      console.log('Response:', response);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };
  

  const handleEdit = (recipe) => {
    setCurrentRecipe(recipe);
    setFormId(recipe.id); // Set the ID of the current recipe
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
    resetFormFields();
  };
  
  const resetFormFields = () => {
    setFormTitle('');
    setFormCategory('');
    setFormIngredients('');
  };

    const handleSaveRecipe = async () => {
      try {
        if (currentRecipe) {
          const updatedRecipe = {
            id: currentRecipe.id, // Ensure the ID is included
            title: formTitle, // Use the updated form values
            category: formCategory,
            ingredients: formIngredients,
          };
    
          await axios.put(`${backend_url}/${currentRecipe.id}`, updatedRecipe);
    
          setRecipes((prevRecipes) =>
            prevRecipes.map((recipe) =>
              recipe.id === currentRecipe.id ? updatedRecipe : recipe
            )
          );
    
          handleCloseModal();
        }
      } catch (error) {
        console.error('Error saving recipe:', error.response); // Log the detailed response
      }
    };
  const handleIdChange = (e) => {
    setFormId(e.target.value);
  };
  
  const handleTitleChange = (e) => {
    setFormTitle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setFormCategory(e.target.value);
  };

  const handleIngredientsChange = (e) => {
    setFormIngredients(e.target.value);
  };
  return (
    <Container>
      <Button variant="info" onClick={() => setShowModal(true)}>Create Recipe</Button>
      <Table striped bordered hover className="my-3">
        <thead>
          <tr>
            <th>id</th>
            <th>Title</th>
            <th>Category</th>
            <th>Ingredients</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe, index) => (
            <tr key={recipe.id}>
              <td>{recipe.id}</td>
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
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label> 
              <Form.Control
              type="text"
              placeholder="Enter ID"
              value={formId}
              onChange={handleIdChange}
              />
              </Form.Group>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={formTitle}
                onChange={handleTitleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={formCategory}
                onChange={handleCategoryChange}
              />
            </Form.Group>
            <Form.Group controlId="formIngredients">
              <Form.Label>Ingredients</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter ingredients"
                value={formIngredients}
                onChange={handleIngredientsChange}
              />
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
