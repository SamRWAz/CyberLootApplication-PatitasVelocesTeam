import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import { updateUser, deleteUser, fetchUsers } from '../slices/UserSlice'
import { updateProduct, deleteProduct, fetchProductsByUserId, deleteAllProductsByUserId } from '../slices/ProductSlice'
import { clearCart } from '../slices/CartSlice'
import { removeAllFavoritesByUserId } from '../slices/FavoriteSlice'
import { deleteAllCommentsByUserId } from '../slices/CommentSlice'
import { signOut } from '../utils/auth'
import { supabase } from '../config/supabase'
import '../styles/pages/profile.css'
import type { User } from '../models/User'
import type { Product } from '../models/Product'

function Profile() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { Users } = useAppSelector((state) => state.users)
  const { Products } = useAppSelector((state) => state.products)
  const [user, setUser] = useState<User | null>(null)
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
    // Cargar usuarios si no están cargados
    if (Users.length === 0) {
      dispatch(fetchUsers())
    }

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
      photo: currentUser.photo || '',
      phone: currentUser.phone,
      address: currentUser.address,
      location: currentUser.location
    })

    // Cargar productos del usuario
    if (currentUser.id) {
      dispatch(fetchProductsByUserId(currentUser.id))
    }
  }, [navigate, dispatch, Users.length])

  // Filtrar productos del usuario actual
  const userProducts = Products.filter(p => p.user_id === user?.id) as any[]

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    const ok = window.confirm('Are you sure you want to delete your account? This action cannot be undone. All your products, cart items, favorites, and comments will be deleted.')
    if (!ok) return

    try {
      console.log('Starting account deletion process...')
      
      // 1. Eliminar todos los productos del usuario
      console.log('Deleting all user products...')
      try {
        await dispatch(deleteAllProductsByUserId(user.id)).unwrap()
        console.log('All products deleted')
      } catch (err) {
        console.error('Error deleting products:', err)
      }

      // 2. Eliminar todos los comentarios del usuario
      console.log('Deleting all user comments...')
      try {
        await dispatch(deleteAllCommentsByUserId(user.id)).unwrap()
        console.log('All comments deleted')
      } catch (err) {
        console.error('Error deleting comments:', err)
      }

      // 3. Eliminar todos los favoritos del usuario
      console.log('Deleting all user favorites...')
      try {
        await dispatch(removeAllFavoritesByUserId(user.id)).unwrap()
        console.log('All favorites deleted')
      } catch (err) {
        console.error('Error deleting favorites:', err)
      }

      // 4. Limpiar el carrito del usuario
      console.log('Clearing user cart...')
      try {
        await dispatch(clearCart(user.id)).unwrap()
        console.log('Cart cleared')
      } catch (err) {
        console.error('Error clearing cart:', err)
      }

      // 5. Eliminar el usuario de la tabla User
      console.log('Deleting user from User table...')
      await dispatch(deleteUser(user.id)).unwrap()
      console.log('User deleted from User table')

      // 6. Hacer signOut de Supabase Auth (no podemos eliminar usuarios desde el cliente sin admin key)
      console.log('Signing out from Supabase Auth...')
      try {
        await supabase.auth.signOut()
        console.log('Signed out from Supabase Auth')
      } catch (authErr) {
        console.error('Error signing out:', authErr)
      }

      // 7. Limpiar localStorage
      localStorage.removeItem('cyberloot_current_user')
      console.log('Account deletion completed')
      
      // 8. Redirigir al login
      navigate('/login')
    } catch (err) {
      console.error('Error deleting account:', err)
      alert('Error deleting account. Please try again.')
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    if (user) {
      setEditFormData({
        fullName: user.fullName,
        email: user.email,
        photo: user.photo || '',
        phone: user.phone,
        address: user.address,
        location: user.location
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!editFormData.fullName || !editFormData.email) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const updatedUser = await dispatch(updateUser({
        ...user,
        fullName: editFormData.fullName,
        email: editFormData.email,
        photo: editFormData.photo || null,
        phone: editFormData.phone,
        address: editFormData.address,
        location: editFormData.location
      })).unwrap()

      localStorage.setItem('cyberloot_current_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setIsEditing(false)
    } catch (err) {
      alert('Error updating profile')
    }
  }

  const handleLogout = async () => {
    console.log('Initiating logout...')
    
    // Limpiar estado de Redux (carrito) de forma no bloqueante
    if (user) {
      dispatch(clearCart(user.id)).unwrap().catch((err) => {
        console.error('Error clearing cart:', err)
      })
    }
    
    // Hacer signOut de Supabase en segundo plano (no bloqueante)
    signOut().catch((error) => {
      console.error('Error signing out (non-blocking):', error)
    })
    
    // Limpiar localStorage y redirigir inmediatamente (no esperar a signOut)
    localStorage.removeItem('cyberloot_current_user')
    console.log('Local storage cleared, navigating to home')
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

  const handleProductEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct || !user) return

    const newPrice = parseFloat(productEditForm.price)
    if (!isFinite(newPrice) || newPrice <= 0) {
      alert('Invalid price')
      return
    }

    try {
      await dispatch(updateProduct({
        ...editingProduct,
        title: productEditForm.title,
        price: newPrice,
        image: productEditForm.image,
        description: productEditForm.description,
        category: productEditForm.category,
        condition: productEditForm.condition,
        user_id: user.id
      })).unwrap()

      dispatch(fetchProductsByUserId(user.id))
      handleProductEditCancel()
    } catch (err) {
      alert('Error updating product')
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    if (!user) return
    const ok = window.confirm('Delete this product? This action cannot be undone.')
    if (!ok) return

    try {
      await dispatch(deleteProduct(product.id)).unwrap()
      dispatch(fetchProductsByUserId(user.id))
    } catch (err) {
      alert('Error deleting product')
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-grid">
          <aside className="profile-left">
            <div className="profile-card">
              <div className="profile-photo-section">
                <img src={user.photo || 'https://via.placeholder.com/150'} alt={user.fullName} className="profile-photo" />
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
                      <span className="contact-value">{user.phone || 'Not provided'}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Address:</span>
                      <span className="contact-value">{user.address || 'Not provided'}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Location:</span>
                      <span className="contact-value">{user.location || 'Not provided'}</span>
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
                  className="btn-logout"
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
                  {userProducts.map((product: any) => (
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
                        {product.user_id === user.id && (
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
