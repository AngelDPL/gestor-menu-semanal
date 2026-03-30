import { useState, useEffect } from 'react'
import { getMealPlans, createMealPlan, deleteMealPlan } from '../../services/mealPlanService'
import { getRecipes } from '../../services/recipeService'
import { useNavigate } from 'react-router-dom'
import RecipeSelect from '../../components/ui/RecipeSelect'

const ALL_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MEALS = ['breakfast', 'lunch', 'dinner']
const MEAL_LABELS = { breakfast: '🌅 Desayuno', lunch: '☀️ Comida', dinner: '🌙 Cena' }

const getDaysFromDate = (dateStr) => {
    if (!dateStr) return ALL_DAYS
    const date = new Date(dateStr + 'T00:00:00')
    const jsDay = date.getDay()
    const startIndex = jsDay === 0 ? 6 : jsDay - 1
    return [...ALL_DAYS.slice(startIndex), ...ALL_DAYS.slice(0, startIndex)]
}

const MealPlanner = () => {
    const [plans, setPlans] = useState([])
    const [recipes, setRecipes] = useState([])
    const [weekStart, setWeekStart] = useState('')
    const [entries, setEntries] = useState({})
    const [openDay, setOpenDay] = useState('Lunes')
    const [showForm, setShowForm] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const days = getDaysFromDate(weekStart)

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        try {
            const [plansData, recipesData] = await Promise.all([getMealPlans(), getRecipes()])
            setPlans(plansData)
            setRecipes(recipesData)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleEntryChange = (day, meal, recipeId) => {
        setEntries({ ...entries, [`${day}_${meal}`]: recipeId })
    }

    const handleDateChange = (e) => {
        setWeekStart(e.target.value)
        setEntries({})
        setOpenDay(getDaysFromDate(e.target.value)[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const entriesArray = Object.entries(entries)
            .filter(([_, recipeId]) => recipeId)
            .map(([key, recipeId]) => {
                const [day, meal] = key.split('_')
                return { day_of_week: day, meal_type: meal, recipe_id: parseInt(recipeId) }
            })
        try {
            await createMealPlan({ week_start_date: weekStart, entries: entriesArray })
            setWeekStart('')
            setEntries({})
            setShowForm(false)
            fetchData()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteMealPlan(id)
            fetchData()
        } catch (err) {
            setError(err.message)
        }
    }

    const getDayCount = (day) => MEALS.filter(meal => entries[`${day}_${meal}`]).length

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white drop-shadow">📅 Planificador Semanal</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-95 border-none shadow-md ${showForm
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-white text-indigo-600 hover:bg-indigo-50'
                        }`}
                >
                    {showForm ? '✕ Cancelar' : '+ Nuevo plan'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                    ⚠️ {error}
                </div>
            )}

            {showForm && (
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Nuevo plan semanal</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Inicio de semana</label>
                            <input
                                type="date"
                                value={weekStart}
                                onChange={handleDateChange}
                                required
                                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            {days.map(day => (
                                <div
                                    key={day}
                                    className={`rounded-xl border transition ${openDay === day ? 'border-indigo-300 bg-indigo-50/50' : 'border-gray-200 bg-white'}`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenDay(openDay === day ? null : day)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-transparent border-none shadow-none text-left"
                                    >
                                        <span className={`font-semibold text-sm ${openDay === day ? 'text-indigo-600' : 'text-gray-700'}`}>
                                            {day}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {getDayCount(day) > 0 && (
                                                <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                                    {getDayCount(day)} asignadas
                                                </span>
                                            )}
                                            <span className="text-gray-400 text-xs">
                                                {openDay === day ? '▲' : '▼'}
                                            </span>
                                        </div>
                                    </button>

                                    {openDay === day && (
                                        <div className="px-4 pb-4 flex flex-col gap-3">
                                            {MEALS.map(meal => (
                                                <div key={meal}>
                                                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                                                        {MEAL_LABELS[meal]}
                                                    </label>
                                                    <RecipeSelect
                                                        value={entries[`${day}_${meal}`] || ''}
                                                        onChange={(recipeId) => handleEntryChange(day, meal, recipeId)}
                                                        recipes={recipes}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                        >
                            Guardar plan
                        </button>
                    </form>
                </div>
            )}

            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-bold text-white drop-shadow mb-1">Planes guardados</h2>
                {loading ? (
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-10 text-center">
                        <div className="text-5xl mb-4">⏳</div>
                        <p className="text-gray-500 text-sm">Cargando planes...</p>
                    </div>
                ) : plans.length === 0 ? (
                    <p className="text-white/60 text-sm">Aún no tienes planes. ¡Crea el primero!</p>
                ) : (
                    plans.map(plan => (
                        <div key={plan.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-gray-800">📅 Semana del {plan.week_start_date}</h4>
                                <p className="text-gray-500 text-sm mt-0.5">{plan.entries.length} comidas planificadas</p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => navigate(`/meal-planner/${plan.id}`)}
                                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-medium rounded-xl transition border-none shadow-none"
                                >
                                    👁 Ver detalle
                                </button>
                                <button
                                    onClick={() => navigate(`/shopping/${plan.id}`)}
                                    className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 text-sm font-medium rounded-xl transition border-none shadow-none"
                                >
                                    🛒 Lista de la compra
                                </button>
                                <button
                                    onClick={() => handleDelete(plan.id)}
                                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-medium rounded-xl transition border-none shadow-none"
                                >
                                    🗑 Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MealPlanner