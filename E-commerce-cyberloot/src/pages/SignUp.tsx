import { useState, useRef } from 'react'
import '../styles/pages/signup.css'
import loginImage from '../assets/LogIn.jpeg'
import logo from '../assets/LogoEc.png'
import { Link, useNavigate } from 'react-router-dom'
import { createUser, saveUserToStorage, getUserByEmail, getUserByUsername } from '../models/User'

function SignUp() {
  const navigate = useNavigate()
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecciona un archivo de imagen válido')
        return
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    const fullName = formData.get('fullname') as string
    const email = formData.get('email') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm-password') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const location = formData.get('location') as string

    // Validaciones
    if (!fullName || !email || !username || !password || !phone || !address || !location) {
      setError('Por favor, completa todos los campos')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    // Verificar si el email ya existe
    if (getUserByEmail(email)) {
      setError('Este email ya está registrado')
      return
    }

    // Verificar si el username ya existe
    if (getUserByUsername(username)) {
      setError('Este nombre de usuario ya está en uso')
      return
    }

    // Validar foto
    if (!photoPreview) {
      setError('Por favor, sube una foto de perfil')
      return
    }

    // Crear usuario
    const newUser = createUser(
      username,
      email,
      fullName,
      password,
      photoPreview,
      {
        phone,
        address,
        location
      }
    )

    // Guardar usuario
    saveUserToStorage(newUser)

    // Guardar usuario actual en sesión
    localStorage.setItem('cyberloot_current_user', JSON.stringify(newUser))

    // Redirigir al perfil
    navigate('/profile')
  }

  return (
    <div className="signup-page">
      <div className="signup-content">
        <div className="signup-image">
          <img src={loginImage} alt="Sign Up" />
        </div>
        <div className="signup-container">
          <div className="signup-header">
            <img src={logo} alt="Logo" className="signup-logo" />
            <h1>Create Account</h1>
          </div>
          {error && <div className="error-message">{error}</div>}
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="photo">Foto de Perfil</label>
              <div className="photo-upload-container">
                {photoPreview ? (
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Preview" />
                    <button
                      type="button"
                      className="change-photo-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Cambiar foto
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="upload-photo-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Subir foto
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input type="text" id="fullname" name="fullname" placeholder="Enter your full name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" placeholder="Enter your username" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" placeholder="Enter your address" required />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input type="text" id="location" name="location" placeholder="Enter your location" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" required />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" required />
            </div>
            <button type="submit" className="btn-submit">Create Account</button>
            <p className="signup-login-link">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp

