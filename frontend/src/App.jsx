import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Recipes from './pages/Recipes'
import MealPlanner from './pages/MealPlanner'
import Shopping from './pages/Shopping'
import MealPlanDetail from './pages/MealPlanDetail'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Cargando...</div>
  return user ? children : <Navigate to="/login" />
}

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={<PrivateRoute><Recipes /></PrivateRoute>} />
        <Route path="/meal-planner" element={<PrivateRoute><MealPlanner /></PrivateRoute>} />
        <Route path="/shopping/:planId" element={<PrivateRoute><Shopping /></PrivateRoute>} />
        <Route path="/meal-planner/:planId" element={<PrivateRoute><MealPlanDetail /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default App