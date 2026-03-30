import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMealPlans } from '../../services/mealPlanService'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MEAL_LABELS = { breakfast: '🌅 Desayuno', lunch: '☀️ Comida', dinner: '🌙 Cena' }
const MEAL_ORDER = ['breakfast', 'lunch', 'dinner']
const MACRO_COLORS = {
    calories: 'bg-orange-50 text-orange-600',
    protein: 'bg-blue-50 text-blue-600',
    carbs: 'bg-yellow-50 text-yellow-600',
    fat: 'bg-green-50 text-green-600',
}

const MealPlanDetail = () => {
    const { planId } = useParams()
    const [plan, setPlan] = useState(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => { fetchPlan() }, [planId])

    const fetchPlan = async () => {
        try {
            const plans = await getMealPlans()
            const found = plans.find(p => p.id === parseInt(planId))
            if (!found) throw new Error('Plan no encontrado')
            setPlan(found)
        } catch (err) {
            setError(err.message)
        }
    }

    const getEntry = (day, mealType) => {
        if (!plan) return null
        return plan.entries.find(e => e.day_of_week === day && e.meal_type === mealType)
    }

    const getTotalMacros = () => {
        if (!plan) return { calories: 0, protein: 0, carbs: 0, fat: 0 }
        return plan.entries.reduce((acc, entry) => {
            if (!entry.recipe) return acc
            return {
                calories: acc.calories + entry.recipe.calories,
                protein: acc.protein + entry.recipe.protein,
                carbs: acc.carbs + entry.recipe.carbs,
                fat: acc.fat + entry.recipe.fat,
            }
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
    }

    if (error) return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl">{error}</div>
        </div>
    )
    if (!plan) return (
        <div className="min-h-screen flex items-center justify-center text-white text-xl">
            Cargando...
        </div>
    )

    const totals = getTotalMacros()

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">

            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h1 className="text-2xl font-bold text-white drop-shadow">
                    📅 Semana del {plan.week_start_date}
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/shopping/${plan.id}`)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition border-none shadow-md"
                    >
                        🛒 Lista de la compra
                    </button>
                    <button
                        onClick={() => navigate('/meal-planner')}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-xl transition border-none shadow-md"
                    >
                        ← Volver
                    </button>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-5 mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-4">Resumen semanal</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { key: 'calories', label: 'kcal totales', value: `🔥 ${Math.round(totals.calories)}` },
                        { key: 'protein', label: 'proteína', value: `💪 ${Math.round(totals.protein)}g` },
                        { key: 'carbs', label: 'carbohidratos', value: `🍞 ${Math.round(totals.carbs)}g` },
                        { key: 'fat', label: 'grasas', value: `🧈 ${Math.round(totals.fat)}g` },
                    ].map(macro => (
                        <div key={macro.key} className={`flex flex-col items-center py-3 px-4 rounded-xl ${MACRO_COLORS[macro.key]}`}>
                            <span className="text-lg font-bold">{macro.value}</span>
                            <span className="text-xs mt-0.5 opacity-70">{macro.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="hidden md:grid grid-cols-7 gap-3">
                {DAYS.map(day => (
                    <div key={day} className="flex flex-col gap-2">
                        <h4 className="text-center text-sm font-bold text-white drop-shadow pb-2 border-b border-white/30">
                            {day}
                        </h4>
                        {MEAL_ORDER.map(mealType => {
                            const entry = getEntry(day, mealType)
                            return (
                                <div
                                    key={mealType}
                                    className={`rounded-xl p-3 flex flex-col gap-1 min-h-20 ${
                                        entry
                                            ? 'bg-white/80 backdrop-blur-md shadow-sm'
                                            : 'bg-white/20 border border-white/20'
                                    }`}
                                >
                                    <span className="text-xs font-semibold text-gray-400">
                                        {MEAL_LABELS[mealType]}
                                    </span>
                                    {entry ? (
                                        <>
                                            <span className="text-xs font-bold text-gray-800 leading-tight">
                                                {entry.recipe.name}
                                            </span>
                                            <span className="text-xs text-orange-500">
                                                🔥 {entry.recipe.calories} kcal
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-xs text-white/40 italic">Sin asignar</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 md:hidden">
                {DAYS.map(day => (
                    <div key={day} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md overflow-hidden">
                        <h4 className="px-4 py-2.5 bg-indigo-50 text-indigo-600 font-bold text-sm border-b border-indigo-100">
                            {day}
                        </h4>
                        <div className="divide-y divide-gray-100">
                            {MEAL_ORDER.map(mealType => {
                                const entry = getEntry(day, mealType)
                                return (
                                    <div key={mealType} className="flex items-center justify-between px-4 py-3">
                                        <span className="text-xs font-medium text-gray-400 w-24">
                                            {MEAL_LABELS[mealType]}
                                        </span>
                                        {entry ? (
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-semibold text-gray-800">
                                                    {entry.recipe.name}
                                                </span>
                                                <span className="text-xs text-orange-500">
                                                    🔥 {entry.recipe.calories} kcal
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-300 italic">Sin asignar</span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MealPlanDetail