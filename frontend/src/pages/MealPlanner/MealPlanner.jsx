import { useState, useEffect } from 'react'
import { getMealPlans, createMealPlan, deleteMealPlan } from '../../services/mealPlanService'
import { getRecipes } from '../../services/recipeService'
import { useNavigate } from 'react-router-dom'
import RecipeSelect from '../../components/ui/RecipeSelect'
import Spinner from '../../components/ui/Spinner'
import CalendarPicker from '../../components/ui/CalendarPicker'
import ConfirmModal from '../../components/ui/ConfirmModal'
import SuccessModal from '../../components/ui/SuccessModal'


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
    const [openDay, setOpenDay] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [showSuccess, setShowSuccess] = useState('')

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

    const handleDelete = async () => {
        try {
            await deleteMealPlan(confirmDelete)
            setConfirmDelete(null)
            setShowSuccess('Plan eliminado correctamente.')
            fetchData()
        } catch (err) {
            setError(err.message)
            setConfirmDelete(null)
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
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6 relative z-10">                    <h2 className="text-lg font-bold text-gray-800 mb-4">Nuevo plan semanal</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        <CalendarPicker
                            value={weekStart}
                            onChange={(date) => handleDateChange({ target: { value: date } })}
                        />

                        {!weekStart && (
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-sm text-indigo-500 text-center">
                                📅 Selecciona primero una fecha de inicio
                            </div>
                        )}

                        {weekStart && (
                            <div className="flex flex-col gap-3">
                                {days.map(day => (
                                    <div
                                        key={day}
                                        className={`rounded-2xl border-2 transition-all ${openDay === day
                                            ? 'border-indigo-400 shadow-md'
                                            : 'border-transparent'
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenDay(openDay === day ? null : day)}
                                            className={`w-full flex items-center justify-between px-5 py-4 border-none shadow-none text-left transition ${openDay === day
                                                ? 'bg-indigo-500'
                                                : 'bg-white/60 hover:bg-white/80'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${openDay === day
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-indigo-50 text-indigo-600'
                                                    }`}>
                                                    {day.slice(0, 2)}
                                                </div>
                                                <span className={`font-semibold text-sm ${openDay === day ? 'text-white' : 'text-gray-700'
                                                    }`}>
                                                    {day}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getDayCount(day) > 0 && (
                                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${openDay === day
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-indigo-100 text-indigo-600'
                                                        }`}>
                                                        {getDayCount(day)} / 3
                                                    </span>
                                                )}
                                                <span className={`text-xs ${openDay === day ? 'text-white/70' : 'text-gray-400'
                                                    }`}>
                                                    {openDay === day ? '▲' : '▼'}
                                                </span>
                                            </div>
                                        </button>

                                        {openDay === day && (
                                            <div className="px-5 pb-4 pt-3 bg-white flex flex-col gap-3">
                                                {MEALS.map(meal => (
                                                    <div key={meal} className="flex items-center gap-3">
                                                        <span className="text-lg w-7 text-center">
                                                            {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'}
                                                        </span>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-semibold text-gray-400 mb-1">
                                                                {MEAL_LABELS[meal].split(' ')[1]}
                                                            </p>
                                                            <RecipeSelect
                                                                value={entries[`${day}_${meal}`] || ''}
                                                                onChange={(recipeId) => handleEntryChange(day, meal, recipeId)}
                                                                recipes={recipes}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                        >
                            Guardar plan
                        </button>
                    </form>
                </div>
            )}

            <div className="flex flex-col gap-3 relative z-0">
                <h2 className="text-lg font-bold text-white drop-shadow mb-1">Planes guardados</h2>
                {loading ? (
                    <Spinner />
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
                                    onClick={() => setConfirmDelete(plan.id)}
                                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-medium rounded-xl transition border-none shadow-none"
                                >
                                    🗑 Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {confirmDelete && (
                    <ConfirmModal
                        title="¿Eliminar plan?"
                        message="Se eliminará el plan y todas sus comidas asignadas."
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
        </div>
    )
}

export default MealPlanner