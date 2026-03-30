import { useState, useRef, useEffect } from 'react'

const RecipeSelect = ({ value, onChange, recipes }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    const selected = recipes.find(r => r.id === parseInt(value))

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 hover:bg-white hover:border-indigo-300 transition text-left shadow-none"
            >
                <span className={selected ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                    {selected ? `🍽️ ${selected.name}` : '— Sin asignar —'}
                </span>
                <span className="text-gray-400 text-xs ml-2">{open ? '▲' : '▼'}</span>
            </button>

            {open && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    <button
                        type="button"
                        onClick={() => { onChange(''); setOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition border-none shadow-none rounded-none ${
                            !value
                                ? 'bg-indigo-50 text-indigo-600 font-medium'
                                : 'text-gray-400 hover:bg-gray-50'
                        }`}
                    >
                        — Sin asignar —
                    </button>

                    <div className="border-t border-gray-100 mx-3" />

                    {recipes.map(r => (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => { onChange(r.id); setOpen(false) }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition border-none shadow-none rounded-none ${
                                value === r.id || parseInt(value) === r.id
                                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <span className="font-medium">{r.name}</span>
                            {r.calories > 0 && (
                                <span className="text-gray-400 text-xs ml-2">🔥 {r.calories} kcal</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RecipeSelect