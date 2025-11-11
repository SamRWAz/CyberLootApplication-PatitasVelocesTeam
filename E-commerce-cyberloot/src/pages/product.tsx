import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { products } from '../components/ProductList'
import { getProductById } from '../models/Product'
import type { Product } from '../models/Product'
import CommentList from '../components/CommentList'
import '../styles/pages/product.css'
import { addToCart } from '../models/User'
import { getFavorites, toggleFavorite } from '../models/User'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)

  useEffect(() => {
    if (id) {
      // Buscar primero en localStorage, luego en el array de productos
      const storedProduct = getProductById(id)
      const arrayProduct = products.find(p => p.id === id)
      const foundProduct = storedProduct || arrayProduct
      if (foundProduct) {
        setProduct(foundProduct)
      }

      const currentUserJson = localStorage.getItem('cyberloot_current_user')
      if (currentUserJson && id) {
        const currentUser = JSON.parse(currentUserJson) as { id: string }
        const favs = getFavorites(currentUser.id)
        setIsFavorite(favs.includes(id))
      } else {
        setIsFavorite(false)
      }
    }
  }, [id])

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="container">
          <p>Product not found</p>
          <button onClick={() => navigate('/')}>Back to home</button>
        </div>
      </div>
    )
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
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
            <h1 className="product-title">{product.title}</h1>
            
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
                <span className="detail-value seller-name">{product.seller}</span>
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
                onClick={(e) => {
                  e.preventDefault()
                const currentUserJson = localStorage.getItem('cyberloot_current_user')
                if (!currentUserJson) {
                  alert('Inicia sesión para agregar al carrito')
                  navigate('/login')
                  return
                }
                const currentUser = JSON.parse(currentUserJson) as { id: string }
                addToCart(currentUser.id, product.id, 1)
                alert('Producto agregado al carrito')
                }}
              >
                Agregar al carrito
              </button>
            <button 
              className="btn-secondary"
              onClick={(e) => {
                e.preventDefault()
                const currentUserJson = localStorage.getItem('cyberloot_current_user')
                if (!currentUserJson) {
                  alert('Inicia sesión para gestionar favoritos')
                  navigate('/login')
                  return
                }
                const currentUser = JSON.parse(currentUserJson) as { id: string }
                const next = toggleFavorite(currentUser.id, product.id)
                setIsFavorite(next.includes(product.id))
              }}
              aria-label="Favorito"
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

