import { useState } from 'react'
import '../styles/pages/login.css'
import loginImage from '../assets/LogIn.jpeg'
import logo from '../assets/LogoEc.png'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../utils/auth'

function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validaciones
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      console.log('Starting login process...');
      // Autenticar con Supabase Auth
      const { user } = await signIn(email, password)
      console.log('Login successful, saving user to localStorage...');

      // Guardar usuario actual en sesión
      localStorage.setItem('cyberloot_current_user', JSON.stringify(user))
      console.log('User saved, navigating to profile...');

      // Redirigir al perfil
      navigate('/profile')
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err?.message || 'Incorrect email or password. Please try again.';
      setError(errorMessage);
      console.error('Error message set:', errorMessage);
    } finally {
      setLoading(false)
    }
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
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
