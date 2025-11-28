import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import { fetchProducts } from '../slices/ProductSlice'
import { addToCart } from '../slices/CartSlice'
import { fetchFavoritesByUserId, toggleFavorite } from '../slices/FavoriteSlice'

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
  const { Favorites } = useAppSelector((state) => state.favorites)
  const [userId, setUserId] = useState<string | null>(null)

  // Cargar productos al montar el componente
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Cargar favoritos desde la base de datos
  useEffect(() => {
    const currentUserJson = localStorage.getItem('cyberloot_current_user')
    if (currentUserJson) {
      try {
        const currentUser = JSON.parse(currentUserJson) as { id: string }
        if (currentUser.id) {
          setUserId(currentUser.id)
          dispatch(fetchFavoritesByUserId(currentUser.id))
        }
      } catch (e) {
        console.error('Error loading user:', e)
        setUserId(null)
      }
    } else {
      setUserId(null)
    }
  }, [dispatch])

  // Obtener IDs de productos favoritos
  const favoriteIds = Favorites.map(f => f.product_id)

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
    <section className="container" style={{ padding: '2.5rem 0' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: 600 }}>{title}</h2>
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
            onClick={(e: ReactMouseEvent<HTMLAnchorElement>) => {
              const target = e.target as HTMLElement
              const favoriteButton = target.closest('button[aria-label="Favorite"]')
              if (favoriteButton) {
                e.preventDefault()
                e.stopPropagation()
                return false
              }
            }}
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-strong)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-soft)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              textAlign: 'left',
              width: '100%',
              padding: 0,
              position: 'relative',
              textDecoration: 'none',
              display: 'block'
            }}
            onMouseEnter={(e: ReactMouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
            }}
            onMouseLeave={(e: ReactMouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
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
                    
                    dispatch(toggleFavorite({ user_id: currentUser.id, product_id: product.id }))
                      .then(() => {
                        // Recargar favoritos para actualizar el estado
                        dispatch(fetchFavoritesByUserId(currentUser.id))
                      })
                      .catch((error) => {
                        console.error('Error toggling favorite:', error)
                        alert('Error managing favorites. Please try again.')
                      })
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
                  background: favoriteIds.includes(product.id) 
                    ? 'linear-gradient(135deg, rgba(125, 211, 252, 0.9), rgba(192, 132, 252, 0.9))' 
                    : 'rgba(0, 0, 0, 0.6)',
                  border: favoriteIds.includes(product.id) 
                    ? '1px solid rgba(192, 132, 252, 0.5)' 
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(4px)',
                  zIndex: 10,
                  boxShadow: favoriteIds.includes(product.id) 
                    ? '0 4px 12px rgba(192, 132, 252, 0.3)' 
                    : 'none'
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
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{product.title}</h3>
              <p style={{ margin: '8px 0 12px', color: 'var(--text-muted)', fontSize: '.95rem', lineHeight: 1.5 }}>
                {product.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{formatPrice(product.price)}</span>
              </div>
              <div style={{ 
                borderTop: '1px solid rgba(255,255,255,0.08)', 
                paddingTop: '8px',
                marginTop: '8px'
              }}>
                <span style={{ 
                  color: 'var(--text-muted)', 
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
                    dispatch(addToCart({ user_id: currentUser.id, product_id: product.id, quantity: 1 }))
                      .then(() => {
                        alert('Product added to cart')
                      })
                      .catch((error) => {
                        console.error('Error adding to cart:', error)
                        alert('Error adding product to cart. Please try again.')
                      })
                  }}
                  style={{
                    marginTop: 10,
                    width: '100%',
                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%)',
                    color: '#050510',
                    border: 'none',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 10px 20px rgba(2,6,23,0.35)',
                    transition: 'transform 0.2s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e: ReactMouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 14px 26px rgba(2,6,23,0.4)'
                  }}
                  onMouseLeave={(e: ReactMouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(2,6,23,0.35)'
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
