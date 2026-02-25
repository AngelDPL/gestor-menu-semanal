import { get, post, put, del } from './api'

export const getRecipes = async () => get('/recipes/')
export const createRecipe = async (data) => post('/recipes/', data)
export const updateRecipe = async (id, data) => put(`/recipes/${id}`, data)
export const deleteRecipe = async (id) => del(`/recipes/${id}`)