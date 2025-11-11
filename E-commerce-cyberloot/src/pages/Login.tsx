import { useState } from 'react'
import '../styles/pages/login.css'
import loginImage from '../assets/LogIn.jpeg'
import logo from '../assets/LogoEc.png'
import { Link, useNavigate } from 'react-router-dom'
import { authenticateUser } from '../models/User'

function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validaciones
    if (!email || !password) {
      setError('Por favor, completa todos los campos')
      return
    }

    // Autenticar usuario
    const user = authenticateUser(email, password)

    if (!user) {
      setError('Email o contraseña incorrectos')
      return
    }

    // Guardar usuario actual en sesión
    localStorage.setItem('cyberloot_current_user', JSON.stringify(user))

    // Redirigir al perfil
    navigate('/profile')
  }

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-container">
          <div className="login-header">
            <img src={logo} alt="Logo" className="login-logo" />
            <h1>Welcome Back</h1>
          </div>
          {error && <div className="error-message">{error}</div>}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                placeholder="Enter your email" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                placeholder="Enter your password" 
                required 
              />
            </div>
            <button type="submit" className="btn-submit">Log In</button>
            <p className="login-signup-link">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>
        <div className="login-image">
          <img src={loginImage} alt="Login" />
        </div>
      </div>
    </div>
  )
}

export default Login

