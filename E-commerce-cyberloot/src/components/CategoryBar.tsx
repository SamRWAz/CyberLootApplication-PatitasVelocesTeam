import '../styles/components/categoryBar.css'
import videogamesIcon from '../assets/Videogames.png'
import consolesIcon from '../assets/Consoles.png'
import accessoriesIcon from '../assets/Headphones.png'
import merchandisingIcon from '../assets/Merchandising.png'
import componentsIcon from '../assets/Components.png'

function CategoryBar(){
    return (
        <div className="category-bar">
            <div className="category-item">
                <button className="category-icon-btn" aria-label="Videogames">
                    <img src={videogamesIcon} alt="" className="category-icon" />
                </button>
                <span className="category-label">Videogames</span>
            </div>
            <div className="category-item">
                <button className="category-icon-btn" aria-label="Consoles">
                    <img src={consolesIcon} alt="" className="category-icon" />
                </button>
                <span className="category-label">Consoles</span>
            </div>
            <div className="category-item">
                <button className="category-icon-btn" aria-label="Accesories">
                    <img src={accessoriesIcon} alt="" className="category-icon" />
                </button>
                <span className="category-label">Accesories</span>
            </div>
            <div className="category-item">
                <button className="category-icon-btn" aria-label="Merchandising">
                    <img src={merchandisingIcon} alt="" className="category-icon" />
                </button>
                <span className="category-label">Merchandising</span>
            </div>
            <div className="category-item">
                <button className="category-icon-btn" aria-label="Components">
                    <img src={componentsIcon} alt="" className="category-icon" />
                </button>
                <span className="category-label">Components</span>
            </div>
        </div>
    )
}

export default CategoryBar