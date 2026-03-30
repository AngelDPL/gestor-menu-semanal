const Spinner = ({ text = 'Cargando...' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="text-white/80 text-sm font-medium">{text}</p>
        </div>
    )
}

export default Spinner