import { useEffect, useState } from 'react'
import '../styles/components/filterBar.css'

export type FilterState = {
  category: '' | 'videogames' | 'consoles' | 'accesories' | 'merchandising' | 'components'
  condition: '' | 'new' | 'used' | 'refurbished'
  priceRange: '' | '0-50' | '50-100' | '100-200' | '200+'
  location: string
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'newest' | 'oldest'
}

type FilterBarProps = {
  values?: FilterState
  onChange?: (next: FilterState) => void
  onApply?: (values: FilterState) => void
}

function FilterBar({ values, onChange, onApply }: FilterBarProps) {
  const [local, setLocal] = useState<FilterState>({
    category: '',
    condition: '',
    priceRange: '',
    location: '',
    sortBy: 'relevance'
  })

  useEffect(() => {
    if (values) {
      setLocal({
        category: values.category,
        condition: values.condition,
        priceRange: values.priceRange,
        location: values.location,
        sortBy: values.sortBy
      })
    }
  }, [values])

  const handleChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const next = { ...local, [key]: value }
    setLocal(next)
    onChange?.(next)
  }

  const current = local

  return (
    <div className="filter-bar">
      <div className="filter-item">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          className="filter-select"
          value={current.category}
          onChange={(e) => handleChange('category', e.target.value as FilterState['category'])}
        >
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
        <select
          id="condition"
          className="filter-select"
          value={current.condition}
          onChange={(e) => handleChange('condition', e.target.value as FilterState['condition'])}
        >
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="price-range">Price Range</label>
        <select
          id="price-range"
          className="filter-select"
          value={current.priceRange}
          onChange={(e) => handleChange('priceRange', e.target.value as FilterState['priceRange'])}
        >
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
          value={current.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      <div className="filter-item">
        <label htmlFor="sort-by">Sort by</label>
        <select
          id="sort-by"
          className="filter-select"
          value={current.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value as FilterState['sortBy'])}
        >
          <option value="relevance">Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <button className="btn-apply-filters" type="button" onClick={() => onApply?.(current)}>
        Apply filters
      </button>
    </div>
  )
}

export default FilterBar

