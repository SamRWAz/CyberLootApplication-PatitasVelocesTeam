import FilterBar from '../components/FilterBar'
import ProductList from '../components/ProductList'
import '../styles/pages/category.css'

function Components() {
  return (
    <div className="category-page">
      <FilterBar />
      <div className="category-content">
        <h1>Components</h1>
        <p>Browse our collection of gaming components</p>
        <ProductList category="components" title="Components" />
      </div>
    </div>
  )
}

export default Components

