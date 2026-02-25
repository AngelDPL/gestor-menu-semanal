import { get, post, del } from './api'

export const getMealPlans = async () => get('/meal-plan/')
export const createMealPlan = async (data) => post('/meal-plan/', data)
export const deleteMealPlan = async (id) => del(`/meal-plan/${id}`)