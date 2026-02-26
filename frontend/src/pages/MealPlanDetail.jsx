import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMealPlans } from '../services/mealPlanService'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MEAL_LABELS = { breakfast: '🌅 Desayuno', lunch: '☀️ Comida', dinner: '🌙 Cena' }
const MEAL_ORDER = ['breakfast', 'lunch', 'dinner']

const MealPlanDetail = () => {
    const { planId } = useParams()
    const [plan, setPlan] = useState(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        fetchPlan()
    }, [planId])

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

    if (error) return <div className="page"><p className="error">{error}</p></div>
    if (!plan) return <div className="loading">Cargando...</div>

    const totals = getTotalMacros()

    return (
        <div className="page">
            <header>
                <h1>📅 Semana del {plan.week_start_date}</h1>
                <div>
                    <button onClick={() => navigate(`/shopping/${plan.id}`)}>🛒 Lista de la compra</button>
                    <button onClick={() => navigate('/meal-planner')}>← Volver</button>
                </div>
            </header>

            <div className="macros-summary">
                <h3>Resumen semanal</h3>
                <div className="macros-summary-grid">
                    <div className="macro-stat">
                        <span className="macro-stat-value">🔥 {Math.round(totals.calories)}</span>
                        <span className="macro-stat-label">kcal totales</span>
                    </div>
                    <div className="macro-stat">
                        <span className="macro-stat-value">💪 {Math.round(totals.protein)}g</span>
                        <span className="macro-stat-label">proteína</span>
                    </div>
                    <div className="macro-stat">
                        <span className="macro-stat-value">🍞 {Math.round(totals.carbs)}g</span>
                        <span className="macro-stat-label">carbohidratos</span>
                    </div>
                    <div className="macro-stat">
                        <span className="macro-stat-value">🧈 {Math.round(totals.fat)}g</span>
                        <span className="macro-stat-label">grasas</span>
                    </div>
                </div>
            </div>

            {/* Tabla de días */}
            <div className="detail-grid">
                {DAYS.map(day => (
                    <div key={day} className="detail-day">
                        <h4 className="detail-day-title">{day}</h4>
                        {MEAL_ORDER.map(mealType => {
                            const entry = getEntry(day, mealType)
                            return (
                                <div key={mealType} className={`detail-meal ${!entry ? 'empty' : ''}`}>
                                    <span className="detail-meal-label">{MEAL_LABELS[mealType]}</span>
                                    {entry ? (
                                        <div className="detail-meal-content">
                                            <span className="detail-meal-name">{entry.recipe.name}</span>
                                            <span className="detail-meal-calories">🔥 {entry.recipe.calories} kcal</span>
                                        </div>
                                    ) : (
                                        <span className="detail-meal-empty">Sin asignar</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MealPlanDetail