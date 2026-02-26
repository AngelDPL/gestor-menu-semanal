import { useState, useEffect } from 'react'
import { updateRecipe } from '../services/recipeService'

const RecipeModal = ({ recipe, onClose, onUpdated }) => {
    const [form, setForm] = useState({ ...recipe })
    const [ingredient, setIngredient] = useState({ name: '', quantity: '', unit: '' })
    const [ingredientError, setIngredientError] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = 'unset' }
    }, [])

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const addIngredient = () => {
        if (!ingredient.name || !ingredient.quantity || !ingredient.unit) {
            setIngredientError('Rellena el nombre, cantidad y unidad antes de añadir.')
            return
        }
        setIngredientError('')
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
            await updateRecipe(form.id, {
                ...form,
                calories: parseFloat(form.calories) || 0,
                protein: parseFloat(form.protein) || 0,
                carbs: parseFloat(form.carbs) || 0,
                fat: parseFloat(form.fat) || 0,
                ingredients: form.ingredients.map(i => ({
                    ...i, quantity: parseFloat(i.quantity)
                }))
            })
            onUpdated()
            onClose()
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Editar receta</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit} className="recipe-form">
                    <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
                    <textarea name="description" placeholder="Descripción" value={form.description || ''} onChange={handleChange} />

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
                    {ingredientError && <p className="error">{ingredientError}</p>}

                    <ul>
                        {form.ingredients.map((ing, i) => (
                            <li key={i}>
                                {ing.name} - {ing.quantity} {ing.unit}
                                <button type="button" onClick={() => removeIngredient(i)}>✕</button>
                            </li>
                        ))}
                    </ul>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Guardar cambios</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RecipeModal