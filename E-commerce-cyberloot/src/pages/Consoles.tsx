import FilterBar from '../components/FilterBar'
import ProductList from '../components/ProductList'
import '../styles/pages/category.css'

function Consoles() {
  return (
    <div className="category-page">
      <FilterBar />
      <div className="category-content">
        <h1>Consoles</h1>
        <p>Browse our collection of gaming consoles</p>
        <ProductList category="consoles" title="Consoles" />
      </div>
    </div>
  )
}

export default Consoles

