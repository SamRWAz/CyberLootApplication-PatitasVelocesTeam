import '../styles/pages/login.css'
import loginImage from '../assets/LogIn.jpeg'
import logo from '../assets/LogoEc.png'

function Login() {
  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-container">
          <div className="login-header">
            <img src={logo} alt="Logo" className="login-logo" />
            <h1>Welcome Back</h1>
          </div>
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" />
            </div>
            <button type="submit" className="btn-submit">Log In</button>
          </form>
        </div>
        <div className="login-image">
          <img src={loginImage} alt="Login" />
        </div>
      </div>
    </div>
  )
}

export default Login

