import '../styles/components/navbar.css'
import logo from '../assets/LogoEc.png'
import searchIcon from '../assets/Search.png'
import { Link } from 'react-router-dom'

function Navbar() {
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
        
        <div className="navbar-buttons">
          <Link to="/login">
            <button className="btn-login">Log In</button>
          </Link>
          <button className="btn-signin">Sign In</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

