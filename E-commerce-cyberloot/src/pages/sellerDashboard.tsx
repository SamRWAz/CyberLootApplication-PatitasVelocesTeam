import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import { createProduct, fetchProductsByUserId } from '../slices/ProductSlice'
import '../styles/pages/seller-dashboard.css'
import type { User } from '../models/User'
import type { Product } from '../models/Product'

function SellerDashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { Products } = useAppSelector((state) => state.products)
  const [user, setUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: 'videogames' as Product['category'],
    condition: 'new' as Product['condition']
  })

  useEffect(() => {
    // Obtener usuario actual de localStorage
    const currentUserJson = localStorage.getItem('cyberloot_current_user')
    if (!currentUserJson) {
      navigate('/login')
      return
    }

    const currentUser: User = JSON.parse(currentUserJson)
    setUser(currentUser)

    // Cargar productos del usuario desde Redux
    if (currentUser.id) {
      dispatch(fetchProductsByUserId(currentUser.id))
    }
  }, [navigate, dispatch])

  // Filtrar productos del usuario actual
  const userProducts = Products.filter(p => p.user_id === user?.id) as any[]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!user) {
      setError('User not found')
      setLoading(false)
      return
    }

    // Validaciones
    if (!formData.title || !formData.description || !formData.price || !formData.image) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      setError('Price must be a valid number greater than 0')
      setLoading(false)
      return
    }

    try {
      // Crear nuevo producto usando Redux
      await dispatch(createProduct({
        title: formData.title,
        description: formData.description,
        price: price,
        image: formData.image,
        user_id: user.id,
        category: formData.category,
        condition: formData.condition
      })).unwrap()

      // Recargar productos del usuario
      dispatch(fetchProductsByUserId(user.id))

      // Limpiar formulario
      setFormData({
        title: '',
        description: '',
        price: '',
        image: '',
        category: 'videogames',
        condition: 'new'
      })
      setShowForm(false)
      setSuccess('Product added successfully')
    } catch (err: any) {
      setError(err.message || 'Error creating product')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)
  }

  if (!user) {
    return <div className="dashboard-loading">Loading...</div>
  }

  return (
    <div className="seller-dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Seller Dashboard</h1>
          <button 
            className="btn-add-product"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {showForm && (
          <form className="product-form" onSubmit={handleSubmit}>
            <h2>New Product</h2>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
                disabled={loading}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (USD)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  <option value="videogames">Videogames</option>
                  <option value="consoles">Consoles</option>
                  <option value="accesories">Accessories</option>
                  <option value="merchandising">Merchandising</option>
                  <option value="components">Components</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="condition">Condition</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </form>
        )}

        <section className="products-section">
          <h2>My Products ({userProducts.length})</h2>
          {userProducts.length === 0 ? (
            <div className="no-products">
              <p>You don't have any products for sale yet. Add your first product!</p>
            </div>
          ) : (
            <div className="products-grid">
              {userProducts.map((product: any) => (
                <div key={product.id} className="product-item">
                  <img src={product.image} alt={product.title} className="product-image" />
                  <div className="product-details">
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">{formatPrice(product.price)}</p>
                    <span className="product-category">{product.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default SellerDashboard
