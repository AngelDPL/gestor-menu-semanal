const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="text-4xl mb-3">🗑️</div>
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{message}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl transition border-none shadow-none"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition border-none shadow-none"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal