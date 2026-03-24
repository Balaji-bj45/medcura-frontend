import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ToastStack from './components/ToastStack.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import LoginPage from './pages/LoginPage.jsx'
import VerifyOtpPage from './pages/VerifyOtpPage.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import CarePage from './pages/CarePage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import ProductListPage from './pages/ProductListPage.jsx'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import OrderSuccessPage from './pages/OrderSuccessPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import OrderDetailsPage from './pages/OrderDetailsPage.jsx'

import AdminRoute from './admin/components/AdminRoute.jsx'
import AdminLayout from './admin/layout/AdminLayout.jsx'
import AdminLoginPage from './admin/pages/AdminLoginPage.jsx'
import DashboardPage from './admin/pages/DashboardPage.jsx'
import CategoriesPage from './admin/pages/CategoriesPage.jsx'
import ProductsPage from './admin/pages/ProductsPage.jsx'
import ProductFormPage from './admin/pages/ProductFormPage.jsx'
import OrdersAdminPage from './admin/pages/OrdersPage.jsx'
import OrderDetailPage from './admin/pages/OrderDetailPage.jsx'
import EnquiriesPage from './admin/pages/EnquiriesPage.jsx'
import AnalyticsPage from './admin/pages/AnalyticsPage.jsx'
import SettingsPage from './admin/pages/SettingsPage.jsx'
import { AdminAuthProvider } from './admin/context/AdminAuthContext.jsx'

function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ block: 'start' })
        return
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search, hash])

  return null
}

function CustomerProtectedRoute({ children }) {
  const { token } = useAuth()
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/care" element={<CarePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route
        path="/checkout"
        element={
          <CustomerProtectedRoute>
            <CheckoutPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <CustomerProtectedRoute>
            <OrdersPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <CustomerProtectedRoute>
            <OrderDetailsPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <CustomerProtectedRoute>
            <ProfilePage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/order-success"
        element={
          <CustomerProtectedRoute>
            <OrderSuccessPage />
          </CustomerProtectedRoute>
        }
      />

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />
        <Route path="orders" element={<OrdersAdminPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="enquiries" element={<EnquiriesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function AppFrame() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <>
        <ScrollToTop />
        <AppRoutes />
        <ToastStack />
      </>
    )
  }

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="mx-auto w-full ">
        <AppRoutes />
      </main>
      <Footer />
      <ToastStack />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <ToastProvider>
            <BrowserRouter>
              <AppFrame />
            </BrowserRouter>
          </ToastProvider>
        </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App
