import { get, post, patch } from './api'

export const generateShoppingList = async (planId) => post(`/shopping/generate/${planId}`)
export const getShoppingList = async (planId) => get(`/shopping/${planId}`)
export const toggleShoppingItem = async (itemId) => patch(`/shopping/item/${itemId}/toggle`)