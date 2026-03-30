import { useState } from 'react'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DAYS_HEADER = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

const CalendarPicker = ({ value, onChange }) => {
    const today = new Date()
    const [viewDate, setViewDate] = useState(value ? new Date(value + 'T00:00:00') : today)

    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()

    const firstDay = new Date(year, month, 1).getDay()
    const startOffset = firstDay === 0 ? 6 : firstDay - 1
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

    const handleDayClick = (day) => {
        const selected = new Date(year, month, day)
        if (selected < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return
        const yyyy = selected.getFullYear()
        const mm = String(selected.getMonth() + 1).padStart(2, '0')
        const dd = String(selected.getDate()).padStart(2, '0')
        onChange(`${yyyy}-${mm}-${dd}`)
    }

    const isPast = (day) => {
        const date = new Date(year, month, day)
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        return date < todayMidnight
    }

    const isSelected = (day) => {
        if (!value) return false
        const selected = new Date(value + 'T00:00:00')
        return selected.getFullYear() === year &&
            selected.getMonth() === month &&
            selected.getDate() === day
    }

    const isInWeek = (day) => {
        if (!value) return false
        const selected = new Date(value + 'T00:00:00')
        const current = new Date(year, month, day)
        const diffTime = current - selected
        const diffDays = diffTime / (1000 * 60 * 60 * 24)
        return diffDays > 0 && diffDays <= 6
    }

    const isToday = (day) => {
        return today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
    }

    const cells = []
    for (let i = 0; i < startOffset; i++) cells.push(null)
    for (let i = 1; i <= daysInMonth; i++) cells.push(i)

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 w-full">

            {/* Header mes */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={prevMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 border-none shadow-none transition text-sm"
                >
                    ‹
                </button>
                <span className="font-bold text-gray-800 text-sm">
                    {MONTHS[month]} {year}
                </span>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 border-none shadow-none transition text-sm"
                >
                    ›
                </button>
            </div>

            {/* Cabecera días */}
            <div className="grid grid-cols-7 mb-2">
                {DAYS_HEADER.map(d => (
                    <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Días */}
            <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => (
                    <div key={i} className="aspect-square">
                        {day && (
                            <button
                                type="button"
                                onClick={() => handleDayClick(day)}
                                disabled={isPast(day)}
                                className={`w-full h-full rounded-xl text-sm font-medium transition border-none shadow-none ${isPast(day)
                                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                        : isSelected(day)
                                            ? 'bg-indigo-500 text-white'
                                            : isInWeek(day)
                                                ? 'bg-indigo-100 text-indigo-600'
                                                : isToday(day)
                                                    ? 'bg-indigo-50 text-indigo-600 font-bold'
                                                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                    }`}
                            >
                                {day}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Fecha seleccionada */}
            {value && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Seleccionado:</span>
                    <span className="text-xs font-semibold text-indigo-600">{value}</span>
                </div>
            )}
        </div>
    )
}

export default CalendarPicker