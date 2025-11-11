import { useState, useEffect } from 'react'
import '../styles/components/navbar.css'
import logo from '../assets/LogoEc.png'
import searchIcon from '../assets/Search.png'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '../models/User'

function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const checkUser = () => {
      const currentUserJson = localStorage.getItem('cyberloot_current_user')
      if (currentUserJson) {
        try {
          const currentUser: User = JSON.parse(currentUserJson)
          setUser(currentUser)
        } catch (e) {
          console.error('Error parsing user data:', e)
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }

    checkUser()

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      checkUser()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Verificar periódicamente (por si el cambio fue en la misma pestaña)
    const interval = setInterval(checkUser, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleProfileClick = () => {
    navigate('/profile')
  }

  const handleCartClick = () => {
    // TODO: Implementar funcionalidad del carrito
    console.log('Cart clicked')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <h2>CyberLoot</h2>
        </Link>
        
        <div className="navbar-search">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for anything..." 
            className="search-input"
          />
        </div>
        
        {user ? (
          <div className="navbar-user-section">
            <button 
              className="btn-cart"
              onClick={handleCartClick}
              aria-label="Shopping cart"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </button>
            <button 
              className="btn-profile-image"
              onClick={handleProfileClick}
              aria-label="User profile"
            >
              <img 
                src={user.photo || 'https://via.placeholder.com/40?text=U'} 
                alt={user.fullName}
                className="profile-image-small"
              />
            </button>
          </div>
        ) : (
          <div className="navbar-buttons">
            <Link to="/login">
              <button className="btn-login">Log In</button>
            </Link>
            <Link to="/signup">
              <button className="btn-signup">Sign Up</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

