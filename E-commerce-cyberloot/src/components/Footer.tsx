import '../styles/components/footer.css'
import logo from '../assets/LogoEc.png'
import { Link } from 'react-router-dom'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src={logo} alt="CyberLoot logo" />
          <p>Community marketplace for gamers. Buy, sell, and trade gear with total confidence.</p>
          <small>© {year} CyberLoot. All rights reserved.</small>
        </div>

        <div className="footer-links">
          <strong>Explore</strong>
          <Link to="/videogames">Videogames</Link>
          <Link to="/consoles">Consoles</Link>
          <Link to="/accesories">Accessories</Link>
          <Link to="/merchandising">Merchandising</Link>
          <Link to="/components">Components</Link>
        </div>

        <div className="footer-newsletter">
          <strong>Stay in the loop</strong>
          <p>Monthly drops, exclusive deals, and curated picks.</p>
          <small className="footer-meta">hello@cyberloot.io · +1 (555) 123-4567</small>
        </div>
      </div>
    </footer>
  )
}

export default Footer

