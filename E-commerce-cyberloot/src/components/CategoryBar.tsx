import '../styles/components/categoryBar.css'
import videogamesIcon from '../assets/Videogames.png'
import consolesIcon from '../assets/Consoles.png'
import accessoriesIcon from '../assets/Headphones.png'
import merchandisingIcon from '../assets/Merchandising.png'
import componentsIcon from '../assets/Components.png'
import { Link } from 'react-router-dom'

function CategoryBar(){
    return (
        <div className="category-bar">
            <div className="category-item">
                <Link to="/videogames">
                    <button className="category-icon-btn" aria-label="Videogames">
                        <img src={videogamesIcon} alt="" className="category-icon" />
                    </button>
                </Link>
                <span className="category-label">Videogames</span>
            </div>
            <div className="category-item">
                <Link to="/consoles">
                    <button className="category-icon-btn" aria-label="Consoles">
                        <img src={consolesIcon} alt="" className="category-icon" />
                    </button>
                </Link>
                <span className="category-label">Consoles</span>
            </div>
            <div className="category-item">
                <Link to="/accesories">
                    <button className="category-icon-btn" aria-label="Accesories">
                        <img src={accessoriesIcon} alt="" className="category-icon" />
                    </button>
                </Link>
                <span className="category-label">Accesories</span>
            </div>
            <div className="category-item">
                <Link to="/merchandising">
                    <button className="category-icon-btn" aria-label="Merchandising">
                        <img src={merchandisingIcon} alt="" className="category-icon" />
                    </button>
                </Link>
                <span className="category-label">Merchandising</span>
            </div>
            <div className="category-item">
                <Link to="/components">
                    <button className="category-icon-btn" aria-label="Components">
                        <img src={componentsIcon} alt="" className="category-icon" />
                    </button>
                </Link>
                <span className="category-label">Components</span>
            </div>
        </div>
    )
}

export default CategoryBar