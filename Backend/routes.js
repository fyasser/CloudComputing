import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Use your backend URL
});

export const getRecipes = () => api.get('/recipes');
export const getRecipeById = (id) => api.get(`/recipes/${id}`);
export const createRecipe = (recipe) => api.post('/recipes', recipe);
export const updateRecipe = (id, updatedRecipe) => api.put(`/recipes/${id}`, updatedRecipe);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
