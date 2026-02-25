import { get, post } from './api'

export const register = async (data) => post('/auth/register', data)
export const login = async (data) => post('/auth/login', data)
export const getMe = async () => get('/auth/me')