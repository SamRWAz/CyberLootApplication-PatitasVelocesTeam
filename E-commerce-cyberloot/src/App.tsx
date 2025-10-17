import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CategoryBar from './components/CategoryBar'
import FeatureBar from './components/FeatureBar'
import ProductList from './components/ProductList'
import NoveltyGallery from './components/NoveltyGallery'
import Login from './pages/Login'
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
