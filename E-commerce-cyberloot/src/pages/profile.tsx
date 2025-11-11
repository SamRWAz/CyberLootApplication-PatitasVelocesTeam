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
    const newTitle = window.prompt('Nuevo título', product.title) ?? product.title
    const newPriceStr = window.prompt('Nuevo precio', String(product.price)) ?? String(product.price)
    const newImage = window.prompt('Nueva URL de imagen', product.image) ?? product.image
    const newDescription = window.prompt('Nueva descripción', product.description) ?? product.description
    const newPrice = parseFloat(newPriceStr)
    if (!isFinite(newPrice) || newPrice <= 0) {
      alert('Precio inválido')
      return
    }
    const updated: Product = { ...product, title: newTitle, price: newPrice, image: newImage, description: newDescription }
    updateProductInStorage(updated)
    setUserProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
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
                  Ver favoritos
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
                            <button className="btn-cancel" onClick={() => handleEditProduct(product)}>Editar</button>
                            <button className="btn-delete-account" onClick={() => handleDeleteProduct(product)}>Eliminar</button>
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
    </div>
  )
}

export default Profile

