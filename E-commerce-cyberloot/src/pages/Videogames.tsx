import FilterBar from '../components/FilterBar'
import ProductList from '../components/ProductList'
import '../styles/pages/category.css'

function Videogames() {
  return (
    <div className="category-page">
      <FilterBar />
      <div className="category-content">
        <h1>Videogames</h1>
        <p>Browse our collection of videogames</p>
        <ProductList category="videogames" title="Videogames" />
      </div>
    </div>
  )
}

export default Videogames

