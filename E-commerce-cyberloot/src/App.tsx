import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CategoryBar from './components/CategoryBar'
import FeatureBar from './components/FeatureBar'
import ProductList from './components/ProductList'
import NoveltyGallery from './components/NoveltyGallery'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/profile'
import Videogames from './pages/Videogames'
import Consoles from './pages/Consoles'
import Accesories from './pages/Accesories'
import Merchandising from './pages/Merchandising'
import Components from './pages/Components'
import SellerDashboard from './pages/sellerDashboard'
import ProductDetail from './pages/product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Favorites from './pages/Favorites'
import Search from './pages/Search'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <main className="main">
              <div className="container">
                <h1>Find anything you need</h1>
                <p>Browse thousands of items from trusted sellers in your area. Buy and sell with confidence on our marketplace.</p>
              </div>
            </main>
            <NoveltyGallery />
            <CategoryBar />
            <FeatureBar />
            <ProductList />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/videogames" element={<Videogames />} />
        <Route path="/consoles" element={<Consoles />} />
        <Route path="/accesories" element={<Accesories />} />
        <Route path="/merchandising" element={<Merchandising />} />
        <Route path="/components" element={<Components />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
