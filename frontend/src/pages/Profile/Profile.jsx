import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { post } from '../../services/api'

const Profile = () => {
    const { user, loginUser } = useAuth()
    const [form, setForm] = useState({ username: user.username, email: user.email })
    const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm_password: '' })
    const [successInfo, setSuccessInfo] = useState('')
    const [successPass, setSuccessPass] = useState('')
    const [errorInfo, setErrorInfo] = useState('')
    const [errorPass, setErrorPass] = useState('')

    const handleInfoChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const handlePassChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value })

    const handleUpdateInfo = async (e) => {
        e.preventDefault()
        setErrorInfo('')
        setSuccessInfo('')
        try {
            const data = await post('/auth/update', form)
            loginUser(localStorage.getItem('token'), data.user)
            setSuccessInfo('Datos actualizados correctamente.')
        } catch (err) {
            setErrorInfo(err.message)
        }
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault()
        setErrorPass('')
        setSuccessPass('')
        if (passwords.new_password !== passwords.confirm_password) {
            setErrorPass('Las contraseñas nuevas no coinciden.')
            return
        }
        try {
            await post('/auth/change-password', {
                current_password: passwords.current_password,
                new_password: passwords.new_password
            })
            setSuccessPass('Contraseña cambiada correctamente.')
            setPasswords({ current_password: '', new_password: '', confirm_password: '' })
        } catch (err) {
            setErrorPass(err.message)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white drop-shadow">👤 Mi Perfil</h1>
            </div>

            {/* Avatar */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 mb-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-800">{user.username}</h2>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Información personal */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-gray-800">Información personal</h3>

                    {errorInfo && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                            ⚠️ {errorInfo}
                        </div>
                    )}
                    {successInfo && (
                        <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl">
                            ✅ {successInfo}
                        </div>
                    )}

                    <form onSubmit={handleUpdateInfo} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Usuario</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleInfoChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleInfoChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                        >
                            Guardar cambios
                        </button>
                    </form>
                </div>

                {/* Cambiar contraseña */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-gray-800">Cambiar contraseña</h3>

                    {errorPass && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                            ⚠️ {errorPass}
                        </div>
                    )}
                    {successPass && (
                        <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl">
                            ✅ {successPass}
                        </div>
                    )}

                    <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Contraseña actual</label>
                            <input
                                type="password"
                                name="current_password"
                                value={passwords.current_password}
                                onChange={handlePassChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Nueva contraseña</label>
                            <input
                                type="password"
                                name="new_password"
                                value={passwords.new_password}
                                onChange={handlePassChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Confirmar nueva contraseña</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={passwords.confirm_password}
                                onChange={handlePassChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                        >
                            Cambiar contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile