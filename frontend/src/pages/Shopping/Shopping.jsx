import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getShoppingList, generateShoppingList, toggleShoppingItem } from '../../services/shoppingService'
import Spinner from '../../components/ui/Spinner'

const Shopping = () => {
    const { planId } = useParams()
    const [items, setItems] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => { fetchList() }, [planId])

    const fetchList = async () => {
        try {
            const data = await getShoppingList(planId)
            setItems(data)
        } catch {
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    const handleGenerate = async () => {
        try {
            const data = await generateShoppingList(planId)
            setItems(data)
        } catch (err) {
            setError(err.message)
        }
    }

    const handleToggle = async (itemId) => {
        try {
            const updated = await toggleShoppingItem(itemId)
            setItems(items.map(i => i.id === updated.id ? updated : i))
        } catch (err) {
            setError(err.message)
        }
    }

    const pending = items.filter(i => !i.checked)
    const checked = items.filter(i => i.checked)
    const progress = items.length > 0 ? Math.round((checked.length / items.length) * 100) : 0

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h1 className="text-2xl font-bold text-white drop-shadow">🛒 Lista de la compra</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleGenerate}
                        className="px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 text-sm font-semibold rounded-xl transition border-none shadow-md"
                    >
                        🔄 Generar lista
                    </button>
                    <button
                        onClick={() => navigate('/meal-planner')}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-xl transition border-none shadow-md"
                    >
                        ← Volver
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                    ⚠️ {error}
                </div>
            )}

            {loading ? (
                <Spinner />
            ) : items.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-10 text-center">
                    <div className="text-5xl mb-4">🛒</div>
                    <p className="text-gray-500 text-sm">No hay items todavía.</p>
                    <p className="text-gray-400 text-xs mt-1">Pulsa "Generar lista" para empezar.</p>
                </div>
            ) : (
                <>
                    {/* Barra de progreso */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-5 mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-700">Progreso</span>
                            <span className="text-sm font-bold text-indigo-600">{checked.length} / {items.length}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">{progress}% completado</p>
                    </div>

                    {/* Pendientes */}
                    {pending.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-sm font-bold text-white/80 mb-2 px-1">
                                Pendiente ({pending.length})
                            </h3>
                            <div className="flex flex-col gap-2">
                                {pending.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleToggle(item.id)}
                                        className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/90 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                                            <span className="text-sm font-medium text-gray-800">{item.name}</span>
                                        </div>
                                        <span className="text-sm text-indigo-600 font-semibold">
                                            {item.quantity} {item.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comprados */}
                    {checked.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-white/80 mb-2 px-1">
                                Comprado ({checked.length})
                            </h3>
                            <div className="flex flex-col gap-2">
                                {checked.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleToggle(item.id)}
                                        className="bg-white/40 backdrop-blur-md rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/50 transition opacity-60"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 line-through">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-400 line-through">
                                            {item.quantity} {item.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Shopping