import '../styles/components/filterBar.css'

function FilterBar() {
  return (
    <div className="filter-bar">
      <div className="filter-item">
        <label htmlFor="category">Category</label>
        <select id="category" className="filter-select">
          <option value="">All Categories</option>
          <option value="videogames">Videogames</option>
          <option value="consoles">Consoles</option>
          <option value="accesories">Accesories</option>
          <option value="merchandising">Merchandising</option>
          <option value="components">Components</option>
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="condition">Condition</label>
        <select id="condition" className="filter-select">
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="price-range">Price Range</label>
        <select id="price-range" className="filter-select">
          <option value="">All Prices</option>
          <option value="0-50">$0 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-200">$100 - $200</option>
          <option value="200+">$200+</option>
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="location">Location</label>
        <input 
          type="text" 
          id="location" 
          className="filter-input" 
          placeholder="Enter location"
        />
      </div>

      <div className="filter-item">
        <label htmlFor="sort-by">Sort by</label>
        <select id="sort-by" className="filter-select">
          <option value="relevance">Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <button className="btn-apply-filters" type="button">
        Apply filters
      </button>
    </div>
  )
}

export default FilterBar

