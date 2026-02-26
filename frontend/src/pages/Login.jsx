import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const { loginUser } = useAuth()
    const [remember, setRemember] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const data = await login(form)
            loginUser(data.access_token, data.user, remember)
            navigate('/recipes')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="auth-container">
            <h2>Iniciar sesión</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <label className="remember-label">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={e => setRemember(e.target.checked)}
                    />
                    Recuérdame
                </label>
                <button type="submit">Entrar</button>
            </form>
            <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
        </div>
    )
}

export default Login