import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import { fetchProducts } from '../slices/ProductSlice'
import { addToCart, getFavorites, toggleFavorite } from '../models/User'

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)
}

interface ProductListProps {
  category?: 'videogames' | 'consoles' | 'accesories' | 'merchandising' | 'components'
  title?: string
  searchQuery?: string
  conditionFilter?: 'new' | 'used' | 'refurbished'
  priceRange?: '' | '0-50' | '50-100' | '100-200' | '200+'
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'newest' | 'oldest'
}

function ProductList({ category, title = 'Featured products', searchQuery, conditionFilter, priceRange, sortBy }: ProductListProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { Products, loading, error } = useAppSelector((state) => state.products)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  // Cargar productos al montar el componente
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Cargar favoritos
  useEffect(() => {
    const loadFavorites = () => {
      const currentUserJson = localStorage.getItem('cyberloot_current_user')
      if (currentUserJson) {
        try {
          const currentUser = JSON.parse(currentUserJson) as { id: string }
          if (currentUser.id) {
            setFavoriteIds(getFavorites(currentUser.id))
          }
        } catch (e) {
          console.error('Error loading favorites:', e)
          setFavoriteIds([])
        }
      } else {
        setFavoriteIds([])
      }
    }

    loadFavorites()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('cyberloot_favorites_')) {
        loadFavorites()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(loadFavorites, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Filtrar productos
  let filteredProducts = Products as any[]
  
  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category === category)
  }
  
  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.trim().toLowerCase()
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )
  }
  
  if (conditionFilter) {
    filteredProducts = filteredProducts.filter(p => p.condition === conditionFilter)
  }
  
  if (priceRange) {
    if (priceRange === '0-50') filteredProducts = filteredProducts.filter(p => p.price >= 0 && p.price < 50)
    if (priceRange === '50-100') filteredProducts = filteredProducts.filter(p => p.price >= 50 && p.price < 100)
    if (priceRange === '100-200') filteredProducts = filteredProducts.filter(p => p.price >= 100 && p.price < 200)
    if (priceRange === '200+') filteredProducts = filteredProducts.filter(p => p.price >= 200)
  }
  
  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
  }

  if (loading) {
    return (
      <section className="container" style={{ padding: '2rem 0' }}>
        <h2 style={{ marginBottom: '1rem' }}>{title}</h2>
        <p style={{ color: '#d1d5db', textAlign: 'center', padding: '2rem' }}>
          Loading products...
        </p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="container" style={{ padding: '2rem 0' }}>
        <h2 style={{ marginBottom: '1rem' }}>{title}</h2>
        <p style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>
          Error loading products: {error}
        </p>
      </section>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <section className="container" style={{ padding: '2rem 0' }}>
        <h2 style={{ marginBottom: '1rem' }}>{title}</h2>
        <p style={{ color: '#d1d5db', textAlign: 'center', padding: '2rem' }}>
          No products available in this category.
        </p>
      </section>
    )
  }

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>{title}</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}
      >
        {filteredProducts.map((product: any) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              const target = e.target as HTMLElement
              const favoriteButton = target.closest('button[aria-label="Favorite"]')
              if (favoriteButton) {
                e.preventDefault()
                e.stopPropagation()
                return false
              }
            }}
            style={{
              border: '1px solid #2a2a2a',
              borderRadius: 0,
              background: '#1D1D1B',
              overflow: 'hidden',
              boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              textAlign: 'left',
              width: '100%',
              padding: 0,
              position: 'relative',
              textDecoration: 'none',
              display: 'block'
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.35)'
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ position: 'relative', paddingTop: '56%' }}>
              <img
                src={product.image}
                alt={product.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  
                  const currentUserJson = localStorage.getItem('cyberloot_current_user')
                  if (!currentUserJson) {
                    alert('Please log in to manage favorites')
                    navigate('/login')
                    return
                  }
                  
                  try {
                    const currentUser = JSON.parse(currentUserJson) as { id: string }
                    if (!currentUser || !currentUser.id) {
                      alert('User session invalid. Please log in again.')
                      navigate('/login')
                      return
                    }
                    
                    const next = toggleFavorite(currentUser.id, product.id)
                    setFavoriteIds([...next])
                    
                    setTimeout(() => {
                      const updated = getFavorites(currentUser.id)
                      setFavoriteIds([...updated])
                    }, 100)
                  } catch (error) {
                    console.error('Error toggling favorite:', error)
                    alert('Error managing favorites. Please try again.')
                  }
                  
                  return false
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onMouseUp={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                aria-label="Favorite"
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: favoriteIds.includes(product.id) ? 'rgba(220, 38, 38, 0.9)' : 'rgba(0, 0, 0, 0.6)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(4px)',
                  zIndex: 10
                }}
              >
                <span style={{ 
                  color: '#ffffff', 
                  fontSize: '16px',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}>
                  {favoriteIds.includes(product.id) ? '❤' : '♡'}
                </span>
              </button>
            </div>

            <div style={{ padding: '16px 16px 12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff' }}>{product.title}</h3>
              <p style={{ margin: '8px 0 12px', color: '#d1d5db', fontSize: '.95rem', lineHeight: 1.5 }}>
                {product.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>{formatPrice(product.price)}</span>
              </div>
              <div style={{ 
                borderTop: '1px solid #2a2a2a', 
                paddingTop: '8px',
                marginTop: '8px'
              }}>
                <span style={{ 
                  color: '#9ca3af', 
                  fontSize: '0.85rem',
                  fontStyle: 'italic'
                }}>
                  Sold by: {product.seller || 'Unknown seller'}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const currentUserJson = localStorage.getItem('cyberloot_current_user')
                    if (!currentUserJson) {
                      alert('Please log in to add to cart')
                      navigate('/login')
                      return
                    }
                    const currentUser = JSON.parse(currentUserJson) as { id: string }
                    addToCart(currentUser.id, product.id, 1)
                    alert('Product added to cart')
                  }}
                  style={{
                    marginTop: 10,
                    width: '100%',
                    background: '#65BEE3',
                    color: '#1D1D1B',
                    border: 'none',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    borderRadius: 4
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ProductList
