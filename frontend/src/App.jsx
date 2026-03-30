import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Recipes from './pages/Recipes'
import MealPlanner from './pages/MealPlanner'
import Shopping from './pages/Shopping'
import MealPlanDetail from './pages/MealPlanDetail'
import Profile from './pages/Profile'

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) return <div className="min-h-screen flex items-center justify-center text-white text-xl">Cargando...</div>
    return user ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) return <div className="min-h-screen flex items-center justify-center text-white text-xl">Cargando...</div>
    return user ? <Navigate to="/recipes" /> : children
}

const App = () => {
    return (
        <div
            className="min-h-screen relative"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="absolute inset-0 bg-black/40 z-0" />

            <div className="relative z-10 min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/recipes" element={<PrivateRoute><Recipes /></PrivateRoute>} />
                        <Route path="/meal-planner" element={<PrivateRoute><MealPlanner /></PrivateRoute>} />
                        <Route path="/shopping/:planId" element={<PrivateRoute><Shopping /></PrivateRoute>} />
                        <Route path="/meal-planner/:planId" element={<PrivateRoute><MealPlanDetail /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default App