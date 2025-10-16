import '../styles/components/featureBar.css'
import shippingIcon from '../assets/Shipping.png'
import supportIcon from '../assets/Support.png'
import handshakeIcon from '../assets/Handshake.png'

function FeatureBar() {
  return (
    <div className="feature-bar">
      <div className="feature-item">
        <img src={shippingIcon} alt="Shipping" className="feature-icon" />
        <h3>Free Shipping</h3>
        <h4>On all orders over $30</h4>
      </div>
      <div className="feature-item">
        <img src={supportIcon} alt="Support" className="feature-icon" />
        <h3>Online Support</h3>
        <h4>24/7 personalized support</h4>
      </div>
      <div className="feature-item">
        <img src={handshakeIcon} alt="Secure Payment" className="feature-icon" />
        <h3>Secure Payment</h3>
        <h4>We ensure secure payment</h4>
      </div>
    </div>
  )
}

export default FeatureBar

