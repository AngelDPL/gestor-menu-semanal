import { useState, useEffect } from 'react'
import { updateRecipe } from '../../services/recipeService'

const unitOptions = ['g', 'kg', 'ml', 'l', 'ud', 'taza', 'cdta', 'cda']

const RecipeModal = ({ recipe, onClose, onUpdated }) => {
    const [form, setForm] = useState({ ...recipe })
    const [ingredient, setIngredient] = useState({ name: '', quantity: '', unit: 'g' })
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
        setIngredient({ name: '', quantity: '', unit: 'g' })
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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">✏️ Editar receta</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl px-3 py-1 text-sm border-none shadow-none transition"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 py-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre</label>
                            <input
                                name="name"
                                placeholder="Nombre de la receta"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Descripción</label>
                            <textarea
                                name="description"
                                placeholder="Descripción"
                                value={form.description || ''}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Macros</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { name: 'calories', placeholder: '🔥 Calorías' },
                                    { name: 'protein', placeholder: '💪 Proteínas (g)' },
                                    { name: 'carbs', placeholder: '🍞 Carbos (g)' },
                                    { name: 'fat', placeholder: '🧈 Grasas (g)' },
                                ].map(field => (
                                    <input
                                        key={field.name}
                                        name={field.name}
                                        type="number"
                                        placeholder={field.placeholder}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Ingredientes</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                                <input
                                    placeholder="Nombre"
                                    value={ingredient.name}
                                    onChange={e => setIngredient({ ...ingredient, name: e.target.value })}
                                    className="col-span-2 sm:col-span-1 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 transition"
                                />
                                <input
                                    type="number"
                                    placeholder="Cantidad"
                                    value={ingredient.quantity}
                                    onChange={e => setIngredient({ ...ingredient, quantity: e.target.value })}
                                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 transition"
                                />
                                <select
                                    value={ingredient.unit}
                                    onChange={e => setIngredient({ ...ingredient, unit: e.target.value })}
                                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 transition"
                                >
                                    {unitOptions.map(u => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={addIngredient}
                                    className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition border-none"
                                >
                                    + Añadir
                                </button>
                            </div>

                            {ingredientError && (
                                <p className="text-red-500 text-xs mb-2">{ingredientError}</p>
                            )}

                            <ul className="flex flex-col gap-1">
                                {form.ingredients.map((ing, i) => (
                                    <li key={i} className="flex justify-between items-center bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-indigo-400">🥄</span>
                                            <span className="font-medium text-gray-700">{ing.name}</span>
                                            <span className="text-gray-400">—</span>
                                            <span className="text-indigo-600 font-semibold">{ing.quantity} {ing.unit}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeIngredient(i)}
                                            className="text-red-400 hover:text-red-600 bg-transparent border-none shadow-none p-0 text-xs font-bold"
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl transition border-none shadow-none"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition border-none active:scale-95"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RecipeModal