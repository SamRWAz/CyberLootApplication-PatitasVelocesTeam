import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/pages/seller-dashboard.css'
import type { User } from '../models/User'
import { saveProductToStorage, getProductsBySellerId } from '../models/Product'
import type { Product } from '../models/Product'
import { addProductToUser } from '../models/User'

function SellerDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [userProducts, setUserProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

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

    // Cargar productos del usuario
    loadUserProducts(currentUser.id)
  }, [navigate])

  const loadUserProducts = (userId: string) => {
    const products = getProductsBySellerId(userId)
    setUserProducts(products)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!user) return

    // Validaciones
    if (!formData.title || !formData.description || !formData.price || !formData.image) {
      setError('Por favor, completa todos los campos')
      return
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      setError('El precio debe ser un número válido mayor a 0')
      return
    }

    // Crear nuevo producto
    const newProduct: Product = {
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      description: formData.description,
      price: price,
      image: formData.image,
      seller: user.fullName,
      sellerId: user.id,
      category: formData.category,
      condition: formData.condition
    }

    // Guardar producto
    saveProductToStorage(newProduct)

    // Agregar producto a la lista del usuario
    addProductToUser(user.id, newProduct.id)

    // Actualizar usuario en localStorage
    const updatedUser = { ...user, productsForSale: [...user.productsForSale, newProduct.id] }
    localStorage.setItem('cyberloot_current_user', JSON.stringify(updatedUser))
    setUser(updatedUser)

    // Recargar productos
    loadUserProducts(user.id)

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
    setSuccess('Producto agregado exitosamente')
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)
  }

  if (!user) {
    return <div className="dashboard-loading">Cargando...</div>
  }

  return (
    <div className="seller-dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Panel de Vendedor</h1>
          <button 
            className="btn-add-product"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : 'Agregar Producto'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {showForm && (
          <form className="product-form" onSubmit={handleSubmit}>
            <h2>Nuevo Producto</h2>
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Precio (USD)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Categoría</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="videogames">Videojuegos</option>
                  <option value="consoles">Consolas</option>
                  <option value="accesories">Accesorios</option>
                  <option value="merchandising">Merchandising</option>
                  <option value="components">Componentes</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="condition">Estado</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                >
                  <option value="new">Nuevo</option>
                  <option value="used">Usado</option>
                  <option value="refurbished">Reacondicionado</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="image">URL de la Imagen</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                required
              />
            </div>
            <button type="submit" className="btn-submit">Guardar Producto</button>
          </form>
        )}

        <section className="products-section">
          <h2>Mis Productos ({userProducts.length})</h2>
          {userProducts.length === 0 ? (
            <div className="no-products">
              <p>No tienes productos en venta aún. ¡Agrega tu primer producto!</p>
            </div>
          ) : (
            <div className="products-grid">
              {userProducts.map((product) => (
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

