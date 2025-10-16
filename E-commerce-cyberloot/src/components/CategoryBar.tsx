import '../styles/components/categoryBar.css'
import videogamesIcon from '../assets/Videogames.png'
import consolesIcon from '../assets/Consoles.png'
import accessoriesIcon from '../assets/Headphones.png'
import merchandisingIcon from '../assets/Merchandising.png'
import componentsIcon from '../assets/Components.png'

function CategoryBar(){
    return (
        <div className="category-bar">
            <button className="category-btn">
                <img src={videogamesIcon} alt="Videogames" className="category-icon" />
                Videogames
            </button>
            <button className="category-btn">
                <img src={consolesIcon} alt="Consoles" className="category-icon" />
                Consoles
            </button>
            <button className="category-btn">
                <img src={accessoriesIcon} alt="Accesories" className="category-icon" />
                Accesories
            </button>
            <button className="category-btn">
                <img src={merchandisingIcon} alt="Merchandising" className="category-icon" />
                Merchandising
            </button>
            <button className="category-btn">
                <img src={componentsIcon} alt="Components" className="category-icon" />
                Components
            </button>
        </div>
    )
}

export default CategoryBar