import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getShoppingList, generateShoppingList, toggleShoppingItem } from '../services/shoppingService'

const Shopping = () => {
  const { planId } = useParams()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchList()
  }, [planId])

  const fetchList = async () => {
    try {
      const data = await getShoppingList(planId)
      setItems(data)
    } catch {
      setItems([])
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

  return (
    <div className="page">
      <header>
        <h1>🛒 Lista de la compra</h1>
        <button onClick={() => navigate('/meal-planner')}>← Volver</button>
      </header>

      {error && <p className="error">{error}</p>}

      <button onClick={handleGenerate}>🔄 Generar / Actualizar lista</button>

      {items.length === 0 ? (
        <p>No hay items todavía. Pulsa el botón para generar la lista.</p>
      ) : (
        <>
          <h3>Pendiente ({pending.length})</h3>
          <ul className="shopping-list">
            {pending.map(item => (
              <li key={item.id} onClick={() => handleToggle(item.id)}>
                <span>☐ {item.name}</span>
                <span>{item.quantity} {item.unit}</span>
              </li>
            ))}
          </ul>

          {checked.length > 0 && (
            <>
              <h3>Comprado ({checked.length})</h3>
              <ul className="shopping-list checked">
                {checked.map(item => (
                  <li key={item.id} onClick={() => handleToggle(item.id)}>
                    <span>✅ {item.name}</span>
                    <span>{item.quantity} {item.unit}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Shopping