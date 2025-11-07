import FilterBar from '../components/FilterBar'
import ProductList from '../components/ProductList'
import '../styles/pages/category.css'

function Merchandising() {
  return (
    <div className="category-page">
      <FilterBar />
      <div className="category-content">
        <h1>Merchandising</h1>
        <p>Browse our collection of gaming merchandising</p>
        <ProductList category="merchandising" title="Merchandising" />
      </div>
    </div>
  )
}

export default Merchandising

