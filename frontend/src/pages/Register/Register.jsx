import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../services/authService'

const Register = () => {
	const [form, setForm] = useState({ username: '', email: '', password: '' })
	const [error, setError] = useState('')
	const [showModal, setShowModal] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [capsLock, setCapsLock] = useState(false)
	const [passwordFocused, setPasswordFocused] = useState(false)

	const navigate = useNavigate()

	const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

	const handleKeyDown = (e) => {
		setCapsLock(e.getModifierState('CapsLock'))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		try {
			await register(form)
			setShowModal(true)
		} catch (err) {
			setError(err.message)
		}
	}

	const handleModalClose = () => {
		setShowModal(false)
		navigate('/login')
	}

	return (
		<div
			className="min-h-screen flex items-center justify-center px-4 relative"
			style={{
				backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			<div className="absolute inset-0 bg-black/35" />

			<div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

				<div className="text-center mb-8">
					<div className="text-4xl mb-3">🍽️</div>
					<h2 className="text-2xl font-bold text-gray-800">Crear cuenta</h2>
					<p className="text-gray-500 text-sm mt-1">Empieza a planificar tus menús</p>
				</div>

				{error && (
					<div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
						⚠️ {error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">

					<div>
						<label className="text-sm font-medium text-gray-700 mb-1 block">Usuario</label>
						<input
							type="text"
							name="username"
							placeholder="nombre"
							value={form.username}
							onChange={handleChange}
							required
							className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
						/>
					</div>

					<div>
						<label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
						<input
							type="email"
							name="email"
							placeholder="ejemplo@email.com"
							value={form.email}
							onChange={handleChange}
							required
							className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
						/>
					</div>

					<div>
						<label className="text-sm font-medium text-gray-700 mb-1 block">Contraseña</label>
						<div className="relative">
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								placeholder="••••••••"
								value={form.password}
								onChange={handleChange}
								onKeyDown={handleKeyDown}
								onFocus={() => setPasswordFocused(true)}
								onBlur={() => setPasswordFocused(false)}
								required
								className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none p-0 shadow-none"
							>
								<i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
							</button>
						</div>
						{capsLock && passwordFocused && (
							<p className="text-amber-500 text-xs mt-1">⚠️ Mayúsculas activadas</p>
						)}
					</div>

					<button
						type="submit"
						className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95"
					>
						Registrarse
					</button>
				</form>

				<p className="text-center text-sm text-gray-500 mt-6">
					¿Ya tienes cuenta?{' '}
					<Link to="/login" className="text-indigo-500 font-semibold hover:underline">
						Inicia sesión
					</Link>
				</p>
			</div>

			{showModal && (
				<div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 px-4">
					<div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center flex flex-col gap-4">
						<div className="text-5xl">🎉</div>
						<h3 className="text-xl font-bold text-gray-800">¡Cuenta creada!</h3>
						<p className="text-gray-500 text-sm">Tu cuenta se ha creado correctamente. Ya puedes iniciar sesión.</p>
						<button
							onClick={handleModalClose}
							className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95"
						>
							Ir al login
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default Register