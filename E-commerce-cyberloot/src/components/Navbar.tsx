import { useState, useEffect } from 'react'
import '../styles/components/navbar.css'
import logo from '../assets/LogoEc.png'
import searchIcon from '../assets/Search.png'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '../models/User'
import { getCurrentUser, onAuthStateChange } from '../utils/auth'

function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Obtener usuario actual al cargar
    getCurrentUser().then(setUser)

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user)
    })

    // También verificar localStorage como fallback
    const checkLocalStorage = () => {
      const currentUserJson = localStorage.getItem('cyberloot_current_user')
      if (currentUserJson) {
        try {
          const currentUser: User = JSON.parse(currentUserJson)
          setUser(currentUser)
        } catch (e) {
          console.error('Error parsing user data:', e)
        }
      }
    }

    checkLocalStorage()

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      checkLocalStorage()
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleProfileClick = () => {
    navigate('/profile')
  }

  const handleCartClick = () => {
    navigate('/cart')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <h2>CyberLoot</h2>
        </Link>
        
        <div className="navbar-search">
          <img 
            src={searchIcon} 
            alt="Search" 
            className="search-icon" 
            onClick={() => {
              const input = (document.querySelector('.search-input') as HTMLInputElement | null)
              const term = input?.value?.trim() || ''
              if (term.length === 0) return
              navigate(`/search?q=${encodeURIComponent(term)}`)
            }}
            style={{ cursor: 'pointer' }}
          />
          <input 
            type="text" 
            placeholder="Search for anything..." 
            className="search-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const term = (e.currentTarget.value || '').trim()
                if (term.length === 0) return
                navigate(`/search?q=${encodeURIComponent(term)}`)
              }
            }}
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

