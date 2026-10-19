import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomBar from './components/BottomBar';

// Public Pages
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Team from './pages/Team';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyPortal from './pages/CompanyPortal';
import UploadCenter from './pages/UploadCenter';
import Profile from './pages/Profile';
import PortfolioManager from './pages/PortfolioManager';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ContentModeration from './pages/admin/ContentModeration';
import SystemLogs from './pages/admin/SystemLogs';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="moderation" element={<ContentModeration />} />
                  <Route path="logs" element={<SystemLogs />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Public Routes */}
                <Route path="/" element={
                  <div className="min-h-screen grid-bg noise-overlay pb-20">
                    <Navbar />
                    <Home />
                    <Footer />
                    <BottomBar />
                  </div>
                } />
                <Route path="/portfolio" element={
                  <div className="min-h-screen grid-bg noise-overlay pb-20">
                    <Navbar />
                    <Portfolio />
                    <Footer />
                    <BottomBar />
                  </div>
                } />
                <Route path="/portfolio/:category" element={
                  <div className="min-h-screen grid-bg noise-overlay pb-20">
                    <Navbar />
                    <Portfolio />
                    <Footer />
                    <BottomBar />
                  </div>
                } />
                <Route path="/team" element={
                  <div className="min-h-screen grid-bg noise-overlay pb-20">
                    <Navbar />
                    <Team />
                    <Footer />
                    <BottomBar />
                  </div>
                } />
                <Route path="/login" element={
                  <div className="min-h-screen grid-bg noise-overlay pb-20">
                    <Navbar />
                    <Login />
                    <Footer />
                    <BottomBar />
                  </div>
                } />
                <Route path="/register" element={
                  <div className="min-h-screen grid-bg noise-overlay pb-20">
                    <Navbar />
                    <Register />
                    <Footer />
                    <BottomBar />
                  </div>
                } />
                <Route path="/company" element={
                  <div className="min-h-screen grid-bg noise-overlay pb-20">
                    <Navbar />
                    <CompanyPortal />
                    <Footer />
                    <BottomBar />
                  </div>
                } />
                <Route path="/upload" element={
                  <div className="min-h-screen grid-bg noise-overlay pb-20">
                    <Navbar />
                    <UploadCenter />
                    <Footer />
                    <BottomBar />
                  </div>
                } />
                <Route path="/profile" element={
                  <div className="min-h-screen grid-bg noise-overlay pb-20">
                    <Navbar />
                    <Profile />
                    <Footer />
                    <BottomBar />
                  </div>
                } />
                <Route path="/portfolio-manager" element={
                  <div className="min-h-screen grid-bg noise-overlay pb-20">
                    <Navbar />
                    <PortfolioManager />
                    <Footer />
                    <BottomBar />
                  </div>
                } />
              </Routes>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
