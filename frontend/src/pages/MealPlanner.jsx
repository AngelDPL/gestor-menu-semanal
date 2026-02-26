import { useState, useEffect } from 'react'
import { getMealPlans, createMealPlan, deleteMealPlan } from '../services/mealPlanService'
import { getRecipes } from '../services/recipeService'
import { useNavigate } from 'react-router-dom'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MEALS = ['breakfast', 'lunch', 'dinner']
const MEAL_LABELS = { breakfast: '🌅 Desayuno', lunch: '☀️ Comida', dinner: '🌙 Cena' }

const MealPlanner = () => {
    const [plans, setPlans] = useState([])
    const [recipes, setRecipes] = useState([])
    const [weekStart, setWeekStart] = useState('')
    const [entries, setEntries] = useState({})
    const [openDay, setOpenDay] = useState('Lunes')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
        const handleResize = () => setIsDesktop(window.innerWidth >= 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const fetchData = async () => {
        try {
            const [plansData, recipesData] = await Promise.all([getMealPlans(), getRecipes()])
            setPlans(plansData)
            setRecipes(recipesData)
        } catch (err) {
            setError(err.message)
        }
    }

    const handleEntryChange = (day, meal, recipeId) => {
        setEntries({ ...entries, [`${day}_${meal}`]: recipeId })
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

    const getDayCount = (day) => {
        return MEALS.filter(meal => entries[`${day}_${meal}`]).length
    }

    return (
        <div className="page">
            <header>
                <h1>📅 Planificador Semanal</h1>
            </header>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit} className="planner-form">
                <h3>Nuevo plan semanal</h3>
                <label>Inicio de semana:</label>
                <input
                    type="date"
                    value={weekStart}
                    onChange={e => setWeekStart(e.target.value)}
                    required
                />

                <div className="days-accordion">
                    {DAYS.map(day => (
                        <div key={day} className={`accordion-item ${openDay === day ? 'open' : ''}`}>
                            <button
                                type="button"
                                className="accordion-header"
                                onClick={() => setOpenDay(openDay === day ? null : day)}
                            >
                                <span>{day}</span>
                                <span className="accordion-meta">
                                    {getDayCount(day) > 0 && (
                                        <span className="badge">{getDayCount(day)} asignadas</span>
                                    )}
                                    <span className="accordion-arrow">{openDay === day ? '▲' : '▼'}</span>
                                </span>
                            </button>

                            {(openDay === day || window.innerWidth >= 768) && (
                                <div className="accordion-body">
                                    {MEALS.map(meal => (
                                        <div key={meal} className="meal-slot">
                                            <label>{MEAL_LABELS[meal]}</label>
                                            <select
                                                value={entries[`${day}_${meal}`] || ''}
                                                onChange={e => handleEntryChange(day, meal, e.target.value)}
                                            >
                                                <option value="">-- Sin asignar --</option>
                                                {recipes.map(r => (
                                                    <option key={r.id} value={r.id}>{r.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button type="submit">Guardar plan</button>
            </form>

            <div className="plans-list">
                <h3>Planes guardados</h3>
                {plans.map(plan => (
                    <div key={plan.id} className="plan-card">
                        <div>
                            <h4>Semana del {plan.week_start_date}</h4>
                            <p>{plan.entries.length} comidas planificadas</p>
                        </div>
                        <div className="plan-actions">
                            <button onClick={() => navigate(`/meal-planner/${plan.id}`)}>👁 Ver detalle</button>
                            <button onClick={() => navigate(`/shopping/${plan.id}`)}>🛒 Lista de la compra</button>
                            <button onClick={() => handleDelete(plan.id)}>🗑 Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MealPlanner