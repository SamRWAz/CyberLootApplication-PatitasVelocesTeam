import '../styles/pages/signup.css'
import loginImage from '../assets/LogIn.jpeg'
import logo from '../assets/LogoEc.png'
import { Link } from 'react-router-dom'

function SignUp() {
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
          <form className="signup-form">
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input type="text" id="fullname" placeholder="Enter your full name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" placeholder="Enter your username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" placeholder="Confirm your password" />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input type="text" id="location" placeholder="Enter your location" />
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

