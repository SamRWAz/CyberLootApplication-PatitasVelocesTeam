import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import { fetchProducts } from '../slices/ProductSlice'
import { fetchCommentsByProductId } from '../slices/CommentSlice'
import { addToCart } from '../slices/CartSlice'
import { toggleFavorite, checkFavorite } from '../slices/FavoriteSlice'
import CommentList from '../components/CommentList'
import '../styles/pages/product.css'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { Products } = useAppSelector((state) => state.products)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Buscar producto en Redux
  const product = Products.find(p => p.id === id) as any

  useEffect(() => {
    // Cargar productos si no están cargados
    if (Products.length === 0) {
      dispatch(fetchProducts())
    }
    
    // Cargar comentarios del producto
    if (id) {
      dispatch(fetchCommentsByProductId(id))
    }

    // Cargar estado de favorito desde la base de datos
    const currentUserJson = localStorage.getItem('cyberloot_current_user')
    if (currentUserJson && id) {
      const currentUser = JSON.parse(currentUserJson) as { id: string }
      setUserId(currentUser.id)
      // Verificar si el producto está en favoritos
      dispatch(checkFavorite({ user_id: currentUser.id, product_id: id }))
        .then((result) => {
          setIsFavorite(result.payload !== null)
        })
        .catch(() => {
          setIsFavorite(false)
        })
    } else {
      setIsFavorite(false)
      setUserId(null)
    }
  }, [id, dispatch, Products.length])

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="container">
          <p>Loading product...</p>
          <button onClick={() => navigate('/')}>Back to home</button>
        </div>
      </div>
    )
  }

  const formatPrice = (value: number | undefined | null | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (numValue === undefined || numValue === null || isNaN(numValue) || numValue <= 0) {
      return 'Price not available'
    }
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(numValue)
  }

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
      'new': 'New',
      'used': 'Used',
      'refurbished': 'Refurbished'
    }
    return labels[condition] || condition
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'videogames': 'Videogames',
      'consoles': 'Consoles',
      'accesories': 'Accessories',
      'merchandising': 'Merchandising',
      'components': 'Components'
    }
    return labels[category] || category
  }

  return (
    <div className="product-detail-container">
      <div className="container">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="product-detail-content">
          <div className="product-image-section">
            <img 
              src={product.image} 
              alt={product.title}
              className="product-main-image"
            />
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{product?.title || 'Title not available'}</h1>
            
            <div className="product-price">
              {formatPrice(product.price)}
            </div>

            <div className="product-details-grid">
              <div className="product-detail-item">
                <span className="detail-label">Condition:</span>
                <span className={`detail-value condition-badge condition-${product.condition}`}>
                  {getConditionLabel(product.condition)}
                </span>
              </div>

              <div className="product-detail-item">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{getCategoryLabel(product.category)}</span>
              </div>

              <div className="product-detail-item">
                <span className="detail-label">Seller:</span>
                <span className="detail-value seller-name">{product.seller || 'Unknown seller'}</span>
              </div>
            </div>

            <div className="product-description-section">
              <h2 className="section-title">Description</h2>
              <p className="product-description">{product.description}</p>
            </div>

            <div className="product-actions">
              <button className="btn-primary">Contact Seller</button>
              <button 
                className="btn-primary" 
                onClick={async (e) => {
                  e.preventDefault()
                  if (!userId) {
                    alert('Please log in to add to cart')
                    navigate('/login')
                    return
                  }
                  try {
                    await dispatch(addToCart({ user_id: userId, product_id: product.id, quantity: 1 })).unwrap()
                    alert('Product added to cart')
                  } catch (error) {
                    console.error('Error adding to cart:', error)
                    alert('Error adding product to cart. Please try again.')
                  }
                }}
              >
                Add to Cart
              </button>
              <button 
                className="btn-secondary"
                onClick={async (e) => {
                  e.preventDefault()
                  if (!userId) {
                    alert('Please log in to manage favorites')
                    navigate('/login')
                    return
                  }
                  try {
                    const result = await dispatch(toggleFavorite({ user_id: userId, product_id: product.id })).unwrap()
                    setIsFavorite(result.isFavorite)
                  } catch (error) {
                    console.error('Error toggling favorite:', error)
                    alert('Error managing favorite. Please try again.')
                  }
                }}
                aria-label="Favorite"
              >
                {isFavorite ? '❤' : '♡'}
              </button>
            </div>
          </div>
        </div>

        <div className="comments-section">
          <CommentList productId={product.id} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
