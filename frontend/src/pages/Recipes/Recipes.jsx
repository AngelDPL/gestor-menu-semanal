import { useState, useEffect } from 'react'
import { getRecipes, createRecipe, deleteRecipe } from '../../services/recipeService'
import { useAuth } from '../../context/AuthContext'
import RecipeModal from '../../components/RecipeModal'
import Spinner from '../../components/ui/Spinner'
import ConfirmModal from '../../components/ui/ConfirmModal'
import SuccessModal from '../../components/ui/SuccessModal'


const emptyForm = {
    name: '', description: '', calories: '', protein: '', carbs: '', fat: '',
    ingredients: []
}

const unitOptions = ['g', 'kg', 'ml', 'l', 'ud', 'taza', 'cdta', 'cda']

const Recipes = () => {
    const [editingRecipe, setEditingRecipe] = useState(null)
    const [recipes, setRecipes] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [ingredient, setIngredient] = useState({ name: '', quantity: '', unit: 'g' })
    const [showForm, setShowForm] = useState(false)
    const [error, setError] = useState('')
    const [ingredientError, setIngredientError] = useState('')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [showSuccess, setShowSuccess] = useState('')

    const { firstLogin, setFirstLogin, user } = useAuth()

    useEffect(() => { fetchRecipes() }, [])

    const fetchRecipes = async () => {
        try {
            const data = await getRecipes()
            setRecipes(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

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
            await createRecipe({
                ...form,
                calories: parseFloat(form.calories) || 0,
                protein: parseFloat(form.protein) || 0,
                carbs: parseFloat(form.carbs) || 0,
                fat: parseFloat(form.fat) || 0,
                ingredients: form.ingredients.map(i => ({ ...i, quantity: parseFloat(i.quantity) }))
            })
            setForm(emptyForm)
            setShowForm(false)
            fetchRecipes()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteRecipe(confirmDelete)
            setConfirmDelete(null)
            setShowSuccess('Receta eliminada correctamente.')
            fetchRecipes()
        } catch (err) {
            setError(err.message)
            setConfirmDelete(null)
        }
    }

    const filteredRecipes = recipes.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white drop-shadow">🍽️ Mis Recetas</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-95 border-none shadow-md ${showForm
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-white text-indigo-600 hover:bg-indigo-50'
                        }`}
                >
                    {showForm ? '✕ Cancelar' : '+ Nueva receta'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                    ⚠️ {error}
                </div>
            )}

            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="🔍 Buscar recetas..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border-none bg-white/20 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition text-sm"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white bg-transparent border-none shadow-none p-0 text-sm"
                    >
                        ✕
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Nueva receta</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            name="name"
                            placeholder="Nombre de la receta"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                        />
                        <textarea
                            name="description"
                            placeholder="Descripción"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition resize-none"
                            rows={2}
                        />

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Ingredientes</h4>
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

                        <button
                            type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                        >
                            Guardar receta
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <Spinner />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecipes.length === 0 && (
                        <div className="col-span-full text-center py-16 text-white/70">
                            {search ? `No hay recetas con "${search}"` : '¡Aún no tienes recetas. Crea la primera!'}
                        </div>
                    )}
                    {filteredRecipes.map(recipe => (
                        <div key={recipe.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg transition">
                            <h3 className="font-bold text-gray-800 text-lg">{recipe.name}</h3>
                            {recipe.description && (
                                <p className="text-gray-500 text-sm">{recipe.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: `🔥 ${recipe.calories} kcal`, color: 'bg-orange-50 text-orange-600' },
                                    { label: `💪 ${recipe.protein}g`, color: 'bg-blue-50 text-blue-600' },
                                    { label: `🍞 ${recipe.carbs}g`, color: 'bg-yellow-50 text-yellow-600' },
                                    { label: `🧈 ${recipe.fat}g`, color: 'bg-green-50 text-green-600' },
                                ].map((m, i) => (
                                    <span key={i} className={`text-xs font-medium px-2.5 py-1 rounded-full ${m.color}`}>
                                        {m.label}
                                    </span>
                                ))}
                            </div>
                            {recipe.ingredients.length > 0 && (
                                <details className="text-sm">
                                    <summary className="cursor-pointer text-indigo-500 font-medium">
                                        Ingredientes ({recipe.ingredients.length})
                                    </summary>
                                    <ul className="mt-2 flex flex-col gap-1">
                                        {recipe.ingredients.map(ing => (
                                            <li key={ing.id} className="text-gray-500 text-xs">
                                                • {ing.name} — {ing.quantity} {ing.unit}
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            )}
                            <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={() => setEditingRecipe(recipe)}
                                    className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-medium py-2 rounded-xl transition border-none shadow-none"
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(recipe.id)}
                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-medium py-2 rounded-xl transition border-none shadow-none"
                                >
                                    🗑 Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editingRecipe && (
                <RecipeModal
                    recipe={editingRecipe}
                    onClose={() => setEditingRecipe(null)}
                    onUpdated={fetchRecipes}
                />
            )}

            {firstLogin && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ background: 'rgba(0,0,0,0.6)' }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center flex flex-col gap-4">
                        <div className="text-5xl">👋</div>
                        <h3 className="text-xl font-bold text-gray-800">¡Bienvenido, {user.username}!</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Para ayudarte a empezar hemos preparado
                            <span className="font-semibold text-indigo-600"> 20 recetas </span>
                            con sus ingredientes y macros ya calculados.
                        </p>
                        <div className="bg-indigo-50 rounded-xl px-4 py-3 flex flex-col gap-1">
                            <span className="text-2xl">🍽️</span>
                            <p className="text-indigo-600 text-sm font-medium">¡Ya puedes crear tu primer plan semanal!</p>
                        </div>
                        <button
                            onClick={() => setFirstLogin(false)}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                        >
                            ¡Empezar! 🚀
                        </button>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <ConfirmModal
                    title="¿Eliminar receta?"
                    message="Esta acción no se puede deshacer."
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}

            {showSuccess && (
                <SuccessModal
                    message={showSuccess}
                    onClose={() => setShowSuccess('')}
                />
            )}
        </div>
    )
}

export default Recipes