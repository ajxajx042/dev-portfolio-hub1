import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomBar from './components/BottomBar';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Team from './pages/Team';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyPortal from './pages/CompanyPortal';
import UploadCenter from './pages/UploadCenter';
import Profile from './pages/Profile';
import PortfolioManager from './pages/PortfolioManager';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <div className="min-h-screen grid-bg noise-overlay pb-20">
                <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:category" element={<Portfolio />} />
                <Route path="/team" element={<Team />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/company" element={<CompanyPortal />} />
                <Route path="/upload" element={<UploadCenter />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/portfolio-manager" element={<PortfolioManager />} />
              </Routes>                <Footer />
                <BottomBar />
              </div>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
