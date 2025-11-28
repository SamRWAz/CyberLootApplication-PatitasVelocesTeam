import { useState } from 'react'
import FilterBar, { type FilterState } from '../components/FilterBar'
import ProductList from '../components/ProductList'
import '../styles/pages/category.css'

type CategoryPageTemplateProps = {
  baseCategory: FilterState['category']
  title: string
  description: string
}

const emptyFilters: FilterState = {
  category: '',
  condition: '',
  priceRange: '',
  location: '',
  sortBy: 'relevance'
}

function CategoryPageTemplate({ baseCategory, title, description }: CategoryPageTemplateProps) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters)

  const handleChange = (next: FilterState) => {
    setFilters(next)
  }

  const handleApply = (next: FilterState) => {
    setFilters(next)
  }

  const effectiveCategory = (filters.category || baseCategory) as FilterState['category']
  const conditionFilter = filters.condition || undefined
  const priceRange = filters.priceRange || undefined
  const sortBy = filters.sortBy || undefined

  return (
    <div className="category-page">
      <FilterBar values={filters} onChange={handleChange} onApply={handleApply} />
      <div className="category-content">
        <h1>{title}</h1>
        <p>{description}</p>
        <ProductList
          title={title}
          category={effectiveCategory || undefined}
          conditionFilter={conditionFilter}
          priceRange={priceRange}
          sortBy={sortBy}
        />
      </div>
    </div>
  )
}

export default CategoryPageTemplate

