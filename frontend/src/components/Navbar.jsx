import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🥗 <span>Gestor Menú</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/recipes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          🍽 Recetas
        </NavLink>
        <NavLink to="/meal-planner" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          📅 Planificador
        </NavLink>
      </div>
      <div className="navbar-user">
        <span className="navbar-username">👤 {user.username}</span>
        <button onClick={handleLogout}>Salir</button>
      </div>
    </nav>
  )
}

export default Navbar