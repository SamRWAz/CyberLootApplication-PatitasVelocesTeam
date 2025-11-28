import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductList from '../components/ProductList'
import FilterBar, { type FilterState } from '../components/FilterBar'
import '../styles/pages/category.css'

function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const category = (params.get('category') || '') as FilterState['category']
  const condition = (params.get('condition') || '') as FilterState['condition']
  const priceRange = (params.get('price') || '') as FilterState['priceRange']
  const sortBy = (params.get('sort') || 'relevance') as FilterState['sortBy']

  const currentFilters: FilterState = useMemo(() => ({
    category,
    condition,
    priceRange,
    location: '',
    sortBy
  }), [category, condition, priceRange, sortBy])

  const handleApply = (values: FilterState) => {
    const next = new URLSearchParams(params)
    next.set('q', q)
    values.category ? next.set('category', values.category) : next.delete('category')
    values.condition ? next.set('condition', values.condition) : next.delete('condition')
    values.priceRange ? next.set('price', values.priceRange) : next.delete('price')
    values.sortBy ? next.set('sort', values.sortBy) : next.delete('sort')
    setParams(next)
  }
  return (
    <div className="category-page">
      <FilterBar values={currentFilters} onApply={handleApply} />
      <div className="category-content">
        <h1>Resultados de búsqueda</h1>
        <p>Mostrando resultados para: {q ? `"${q}"` : 'Todos'}</p>
        <ProductList 
          title={`Resultados`} 
          searchQuery={q} 
          category={category || undefined}
          conditionFilter={condition || undefined}
          priceRange={priceRange || undefined}
          sortBy={sortBy || undefined}
        />
      </div>
    </div>
  )
}

export default Search


