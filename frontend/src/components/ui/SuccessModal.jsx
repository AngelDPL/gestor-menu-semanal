const SuccessModal = ({ message, onClose }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4 text-center"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-4xl">✅</div>
                <h3 className="text-lg font-bold text-gray-800">{message}</h3>
                <button
                    onClick={onClose}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition border-none shadow-none"
                >
                    Aceptar
                </button>
            </div>
        </div>
    )
}

export default SuccessModal