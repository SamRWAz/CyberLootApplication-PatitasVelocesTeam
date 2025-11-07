import FilterBar from '../components/FilterBar'
import ProductList from '../components/ProductList'
import '../styles/pages/category.css'

function Accesories() {
  return (
    <div className="category-page">
      <FilterBar />
      <div className="category-content">
        <h1>Accesories</h1>
        <p>Browse our collection of gaming accessories</p>
        <ProductList category="accesories" title="Accesories" />
      </div>
    </div>
  )
}

export default Accesories

