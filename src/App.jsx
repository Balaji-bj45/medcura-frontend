import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ToastStack from './components/ToastStack.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AdminAuthProvider } from './admin/context/AdminAuthContext.jsx'
import Loader from './components/Loader.jsx'
import AdminRoute from './admin/components/AdminRoute.jsx'

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const CarePage = lazy(() => import('./pages/CarePage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const ProductListPage = lazy(() => import('./pages/ProductListPage.jsx'))
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage.jsx'))
const CartPage = lazy(() => import('./pages/CartPage.jsx'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'))
const OrdersPage = lazy(() => import('./pages/OrdersPage.jsx'))
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage.jsx'))

const AdminLayout = lazy(() => import('./admin/layout/AdminLayout.jsx'))
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage.jsx'))
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage.jsx'))
const CategoriesPage = lazy(() => import('./admin/pages/CategoriesPage.jsx'))
const ProductsPage = lazy(() => import('./admin/pages/ProductsPage.jsx'))
const ProductFormPage = lazy(() => import('./admin/pages/ProductFormPage.jsx'))
const OrdersAdminPage = lazy(() => import('./admin/pages/OrdersPage.jsx'))
const OrderDetailPage = lazy(() => import('./admin/pages/OrderDetailPage.jsx'))
const EnquiriesPage = lazy(() => import('./admin/pages/EnquiriesPage.jsx'))
const AnalyticsPage = lazy(() => import('./admin/pages/AnalyticsPage.jsx'))
const SettingsPage = lazy(() => import('./admin/pages/SettingsPage.jsx'))

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
    <Suspense
      fallback={
        <section className="px-4 py-8 sm:px-6 lg:px-10">
          <Loader label="Loading page..." />
        </section>
      }
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/care" element={<CarePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
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
    </Suspense>
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
