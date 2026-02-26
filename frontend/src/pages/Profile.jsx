import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { post } from '../services/api'

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
        <div className="page">
            <header>
                <h1>👤 Mi Perfil</h1>
            </header>

            <div className="profile-grid">
                <div className="profile-card">
                    <h3>Información personal</h3>
                    {errorInfo && <p className="error">{errorInfo}</p>}
                    {successInfo && <p className="success">{successInfo}</p>}
                    <form onSubmit={handleUpdateInfo}>
                        <label>Usuario</label>
                        <input name="username" value={form.username} onChange={handleInfoChange} required />
                        <label>Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleInfoChange} required />
                        <button type="submit">Guardar cambios</button>
                    </form>
                </div>

                <div className="profile-card">
                    <h3>Cambiar contraseña</h3>
                    {errorPass && <p className="error">{errorPass}</p>}
                    {successPass && <p className="success">{successPass}</p>}
                    <form onSubmit={handleUpdatePassword}>
                        <label>Contraseña actual</label>
                        <input type="password" name="current_password" value={passwords.current_password} onChange={handlePassChange} required />
                        <label>Nueva contraseña</label>
                        <input type="password" name="new_password" value={passwords.new_password} onChange={handlePassChange} required />
                        <label>Confirmar nueva contraseña</label>
                        <input type="password" name="confirm_password" value={passwords.confirm_password} onChange={handlePassChange} required />
                        <button type="submit">Cambiar contraseña</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile