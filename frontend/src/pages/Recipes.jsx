import { useState, useEffect } from 'react'
import { getRecipes, createRecipe, deleteRecipe } from '../services/recipeService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const emptyForm = {
  name: '', description: '', calories: '', protein: '', carbs: '', fat: '',
  ingredients: []
}

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [ingredient, setIngredient] = useState({ name: '', quantity: '', unit: '' })
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const { logoutUser, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes()
      setRecipes(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const addIngredient = () => {
    if (!ingredient.name || !ingredient.quantity || !ingredient.unit) return
    setForm({ ...form, ingredients: [...form.ingredients, ingredient] })
    setIngredient({ name: '', quantity: '', unit: '' })
  }

  const removeIngredient = (index) => {
    setForm({ ...form, ingredients: form.ingredients.filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createRecipe({
        ...form,
        calories: parseFloat(form.calories) || 0,
        protein: parseFloat(form.protein) || 0,
        carbs: parseFloat(form.carbs) || 0,
        fat: parseFloat(form.fat) || 0,
        ingredients: form.ingredients.map(i => ({
          ...i, quantity: parseFloat(i.quantity)
        }))
      })
      setForm(emptyForm)
      setShowForm(false)
      fetchRecipes()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(id)
      fetchRecipes()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <header>
        <h1>Mis Recetas</h1>
        <div>
          <button onClick={() => navigate('/meal-planner')}>📅 Planificador</button>
          <button onClick={logoutUser}>Cerrar sesión</button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : '+ Nueva receta'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="recipe-form">
          <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
          <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} />
          <div className="macros">
            <input name="calories" type="number" placeholder="Calorías" value={form.calories} onChange={handleChange} />
            <input name="protein" type="number" placeholder="Proteínas (g)" value={form.protein} onChange={handleChange} />
            <input name="carbs" type="number" placeholder="Carbohidratos (g)" value={form.carbs} onChange={handleChange} />
            <input name="fat" type="number" placeholder="Grasas (g)" value={form.fat} onChange={handleChange} />
          </div>

          <h4>Ingredientes</h4>
          <div className="ingredient-row">
            <input placeholder="Nombre" value={ingredient.name} onChange={e => setIngredient({ ...ingredient, name: e.target.value })} />
            <input type="number" placeholder="Cantidad" value={ingredient.quantity} onChange={e => setIngredient({ ...ingredient, quantity: e.target.value })} />
            <input placeholder="Unidad (g, ml...)" value={ingredient.unit} onChange={e => setIngredient({ ...ingredient, unit: e.target.value })} />
            <button type="button" onClick={addIngredient}>Añadir</button>
          </div>
          <ul>
            {form.ingredients.map((ing, i) => (
              <li key={i}>{ing.name} - {ing.quantity} {ing.unit} <button type="button" onClick={() => removeIngredient(i)}>✕</button></li>
            ))}
          </ul>

          <button type="submit">Guardar receta</button>
        </form>
      )}

      <div className="recipes-grid">
        {recipes.map(recipe => (
          <div key={recipe.id} className="recipe-card">
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
            <div className="macros-display">
              <span>🔥 {recipe.calories} kcal</span>
              <span>💪 {recipe.protein}g proteína</span>
              <span>🍞 {recipe.carbs}g carbos</span>
              <span>🧈 {recipe.fat}g grasa</span>
            </div>
            {recipe.ingredients.length > 0 && (
              <details>
                <summary>Ingredientes ({recipe.ingredients.length})</summary>
                <ul>
                  {recipe.ingredients.map(ing => (
                    <li key={ing.id}>{ing.name} - {ing.quantity} {ing.unit}</li>
                  ))}
                </ul>
              </details>
            )}
            <button onClick={() => handleDelete(recipe.id)}>🗑 Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Recipes