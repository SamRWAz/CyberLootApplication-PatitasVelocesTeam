import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/pages/profile.css'
import type { User } from '../models/User'
import { deleteUserById, updateUser } from '../models/User'
import { getProductsBySellerId } from '../models/Product'
import type { Product } from '../models/Product'
import { updateProductInStorage, deleteProductFromStorage } from '../models/Product'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [userProducts, setUserProducts] = useState<Product[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productEditForm, setProductEditForm] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: 'videogames' as Product['category'],
    condition: 'new' as Product['condition']
  })
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    photo: '',
    phone: '',
    address: '',
    location: ''
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

    // Inicializar formulario de edición
    setEditFormData({
      fullName: currentUser.fullName,
      email: currentUser.email,
      photo: currentUser.photo,
      phone: currentUser.contactInfo.phone,
      address: currentUser.contactInfo.address,
      location: currentUser.contactInfo.location
    })

    // Obtener productos del usuario usando sellerId
    if (currentUser.id) {
      const products = getProductsBySellerId(currentUser.id)
      setUserProducts(products)
    }
  }, [navigate])

  // Recargar productos cuando se editen
  useEffect(() => {
    if (user && !editingProduct) {
      const products = getProductsBySellerId(user.id)
      setUserProducts(products)
    }
  }, [user, editingProduct])

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>
  }

  const handleDeleteAccount = () => {
    if (!user) return

    // Eliminar usuario
    const deleted = deleteUserById(user.id)
    
    if (deleted) {
      // Limpiar sesión
      localStorage.removeItem('cyberloot_current_user')
      // Redirigir al login
      navigate('/login')
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    // Restaurar valores originales
    if (user) {
      setEditFormData({
        fullName: user.fullName,
        email: user.email,
        photo: user.photo,
        phone: user.contactInfo.phone,
        address: user.contactInfo.address,
        location: user.contactInfo.location
      })
    }
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Validaciones básicas
    if (!editFormData.fullName || !editFormData.email) {
      alert('Please fill in all required fields')
      return
    }

    // Actualizar usuario
    const updatedUser: User = {
      ...user,
      fullName: editFormData.fullName,
      email: editFormData.email,
      photo: editFormData.photo || user.photo,
      contactInfo: {
        phone: editFormData.phone,
        address: editFormData.address,
        location: editFormData.location
      }
    }

    // Guardar en localStorage y actualizar estado
    updateUser(updatedUser)
    localStorage.setItem('cyberloot_current_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
  }

  const handleLogout = () => {
    // Limpiar sesión
    localStorage.removeItem('cyberloot_current_user')
    // Redirigir al inicio
    navigate('/')
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductEditForm({
      title: product.title,
      description: product.description,
      price: String(product.price),
      image: product.image,
      category: product.category,
      condition: product.condition
    })
  }

  const handleProductEditCancel = () => {
    setEditingProduct(null)
    setProductEditForm({
      title: '',
      description: '',
      price: '',
      image: '',
      category: 'videogames',
      condition: 'new'
    })
  }

  const handleProductEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProductEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProductEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    const newPrice = parseFloat(productEditForm.price)
    if (!isFinite(newPrice) || newPrice <= 0) {
      alert('Precio inválido')
      return
    }

    const updated: Product = {
      ...editingProduct,
      title: productEditForm.title,
      price: newPrice,
      image: productEditForm.image,
      description: productEditForm.description,
      category: productEditForm.category,
      condition: productEditForm.condition
    }
    updateProductInStorage(updated)
    setUserProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
    handleProductEditCancel()
  }

  const handleDeleteProduct = (product: Product) => {
    if (!user) return
    const ok = window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')
    if (!ok) return
    deleteProductFromStorage(product.id)
    // remover de los productos del usuario
    const nextUser: User = { ...user, productsForSale: user.productsForSale.filter(id => id !== product.id) }
    updateUser(nextUser)
    localStorage.setItem('cyberloot_current_user', JSON.stringify(nextUser))
    setUser(nextUser)
    setUserProducts(prev => prev.filter(p => p.id !== product.id))
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-grid">
          <aside className="profile-left">
            <div className="profile-card">
              <div className="profile-photo-section">
                <img src={user.photo} alt={user.fullName} className="profile-photo" />
              </div>
              <div className="profile-basic-info">
                <h1 className="profile-name">{user.fullName}</h1>
                <p className="profile-username">@{user.username}</p>
                <p className="profile-email">{user.email}</p>
              </div>

              {isEditing ? (
                <section className="edit-section">
                  <h2>Edit Profile</h2>
                  <form className="edit-form" onSubmit={handleEditSubmit}>
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={editFormData.fullName}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="photo">Photo URL</label>
                      <input
                        type="url"
                        id="photo"
                        name="photo"
                        value={editFormData.photo}
                        onChange={handleEditInputChange}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={editFormData.address}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="edit-form-buttons">
                      <button type="submit" className="btn-save">Save Changes</button>
                      <button type="button" className="btn-cancel" onClick={handleEditCancel}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </section>
              ) : (
                <section className="contact-section">
                  <h2>Contact Information</h2>
                  <div className="contact-info">
                    <div className="contact-item">
                      <span className="contact-label">Phone:</span>
                      <span className="contact-value">{user.contactInfo.phone || 'Not provided'}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Address:</span>
                      <span className="contact-value">{user.contactInfo.address || 'Not provided'}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Location:</span>
                      <span className="contact-value">{user.contactInfo.location || 'Not provided'}</span>
                    </div>
                  </div>
                </section>
              )}

              <div className="left-actions">
                {!isEditing && (
                  <button 
                    className="btn-edit-profile"
                    onClick={handleEditClick}
                  >
                    Edit Profile
                  </button>
                )}
                <button 
                  className="btn-add-product"
                  onClick={() => navigate('/favorites')}
                >
                  View Favorites
                </button>
                <button 
                  className="btn-logout"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
                {!showDeleteConfirm ? (
                  <button 
                    className="btn-delete-account"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="delete-confirm">
                    <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                    <div className="delete-buttons">
                      <button 
                        className="btn-confirm-delete"
                        onClick={handleDeleteAccount}
                      >
                        Yes, delete account
                      </button>
                      <button 
                        className="btn-cancel-delete"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <main className="profile-right">
            <section className="products-section">
              <div className="products-section-header">
                <h2>Products for Sale ({userProducts.length})</h2>
                <button 
                  className="btn-add-product"
                  onClick={() => navigate('/seller-dashboard')}
                >
                  Add Product
                </button>
              </div>
              {userProducts.length === 0 ? (
                <div className="no-products">
                  <p>You don't have any products for sale yet.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {userProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="product-item"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img src={product.image} alt={product.title} className="product-image" />
                      <div className="product-details">
                        <h3 className="product-title">{product.title}</h3>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">{formatPrice(product.price)}</p>
                        <span className="product-category">{product.category}</span>
                        {product.sellerId === user.id && (
                          <div style={{ display: 'flex', gap: 8, marginTop: 10 }} onClick={(e) => e.stopPropagation()}>
                            <button className="btn-cancel" onClick={() => handleEditProduct(product)}>Edit</button>
                            <button className="btn-delete-account" onClick={() => handleDeleteProduct(product)}>Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Modal de edición de producto */}
      {editingProduct && (
        <div className="modal-overlay" onClick={handleProductEditCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button className="modal-close" onClick={handleProductEditCancel}>×</button>
            </div>
            <form className="product-edit-form" onSubmit={handleProductEditSubmit}>
              <div className="form-group">
                <label htmlFor="product-title">Title *</label>
                <input
                  type="text"
                  id="product-title"
                  name="title"
                  value={productEditForm.title}
                  onChange={handleProductEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="product-description">Description *</label>
                <textarea
                  id="product-description"
                  name="description"
                  value={productEditForm.description}
                  onChange={handleProductEditChange}
                  rows={4}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="product-price">Price (USD) *</label>
                  <input
                    type="number"
                    id="product-price"
                    name="price"
                    value={productEditForm.price}
                    onChange={handleProductEditChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="product-category">Category *</label>
                  <select
                    id="product-category"
                    name="category"
                    value={productEditForm.category}
                    onChange={handleProductEditChange}
                    required
                  >
                    <option value="videogames">Videogames</option>
                    <option value="consoles">Consoles</option>
                    <option value="accesories">Accessories</option>
                    <option value="merchandising">Merchandising</option>
                    <option value="components">Components</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="product-condition">Condition *</label>
                  <select
                    id="product-condition"
                    name="condition"
                    value={productEditForm.condition}
                    onChange={handleProductEditChange}
                    required
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="product-image">Image URL *</label>
                <input
                  type="url"
                  id="product-image"
                  name="image"
                  value={productEditForm.image}
                  onChange={handleProductEditChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-save">Save Changes</button>
                <button type="button" className="btn-cancel" onClick={handleProductEditCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile

