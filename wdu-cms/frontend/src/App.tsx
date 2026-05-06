import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ExperiencePage from './pages/ExperiencePage';
import ContactPage from './pages/ContactPage';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './components/AdminLayout';
import Dashboard from './admin/Dashboard';
import HalamanPage from './admin/HalamanPage';
import AdminServicesPage from './admin/ServicesPage';
import AdminExperiencePage from './admin/ExperiencePage';
import MediaPage from './admin/MediaPage';
import ConfigPage from './admin/ConfigPage';
import UsersPage from './admin/UsersPage';
import ClientsPage from './admin/ClientsPage';
import GalleryPage from './admin/GalleryPage';
import MessagesPage from './admin/MessagesPage';
import ProfilePage from './admin/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import { Navigate } from 'react-router-dom';
function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tentang-kami" element={<AboutPage />} />
        <Route path="/layanan" element={<ServicesPage />} />
        <Route path="/pengalaman" element={<ExperiencePage />} />
        <Route path="/kontak" element={<ContactPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        {/* Redirect /admin to /admin/dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Pages */}
        <Route path="pages" element={<HalamanPage />} />
        <Route path="pages/:slug" element={<HalamanPage />} />
        
        {/* Services */}
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="services/new" element={<AdminServicesPage />} />
        <Route path="services/:id" element={<AdminServicesPage />} />
        
        {/* Projects (Experience) */}
        <Route path="projects" element={<AdminExperiencePage />} />
        <Route path="projects/new" element={<AdminExperiencePage />} />
        <Route path="projects/:id" element={<AdminExperiencePage />} />
        
        {/* Media */}
        <Route path="media" element={<MediaPage />} />
        
        {/* Contact Messages */}
        <Route path="contact" element={<MessagesPage />} />
        
        {/* Config & Users */}
        <Route path="config" element={<ConfigPage />} />
        <Route path="users" element={<UsersPage />} />
        
        {/* Clients */}
        <Route path="clients" element={<ClientsPage />} />
        
        {/* Gallery */}
        <Route path="gallery" element={<GalleryPage />} />
        
        {/* Profile */}
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;