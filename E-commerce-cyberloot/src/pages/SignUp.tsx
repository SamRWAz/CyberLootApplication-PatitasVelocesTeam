import { useState, useRef } from 'react'
import '../styles/pages/signup.css'
import loginImage from '../assets/LogIn.jpeg'
import logo from '../assets/LogoEc.png'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../utils/auth'

function SignUp() {
  const navigate = useNavigate()
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        // Comprimir la imagen si es muy grande (más de 500KB en base64)
        if (result.length > 500000) {
          // Crear una imagen para redimensionarla
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const maxWidth = 800
            const maxHeight = 800
            let width = img.width
            let height = img.height

            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width
                width = maxWidth
              }
            } else {
              if (height > maxHeight) {
                width = (width * maxHeight) / height
                height = maxHeight
              }
            }

            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height)
              const compressed = canvas.toDataURL('image/jpeg', 0.7)
              setPhotoPreview(compressed)
              setError('')
            } else {
              setPhotoPreview(result)
              setError('')
            }
          }
          img.src = result
        } else {
          setPhotoPreview(result)
          setError('')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
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
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      // Validar foto
      if (!photoPreview) {
        setError('Please upload a profile photo')
        setLoading(false)
        return
      }

      // Crear usuario con Supabase Auth
      const { user } = await signUp(email, password, {
        username,
        fullName,
        photo: photoPreview,
        phone,
        address,
        location,
      })

      // Guardar usuario actual en sesión
      localStorage.setItem('cyberloot_current_user', JSON.stringify(user))

      // Resetear loading antes de navegar
      setLoading(false)

      // Redirigir al perfil
      navigate('/profile')
    } catch (err: any) {
      console.error('Error creating account:', err)
      // Extraer mensaje de error más específico
      let errorMessage = 'Error creating account. Please try again.'
      
      if (err?.message) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      setError(errorMessage)
      setLoading(false)
    }
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
              <label htmlFor="photo">Profile Photo</label>
              <div className="photo-upload-container">
                {photoPreview ? (
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Preview" />
                    <button
                      type="button"
                      className="change-photo-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change photo
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="upload-photo-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload photo
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
              <input type="text" id="fullname" name="fullname" placeholder="Enter your full name" required disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" required disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" placeholder="Enter your username" required disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" placeholder="Enter your address" required disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input type="text" id="location" name="location" placeholder="Enter your location" required disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" required disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" required disabled={loading} />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
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
