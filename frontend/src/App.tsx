import { Routes, Route, Navigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, TrendingUp, FileBarChart, User, Phone, Mail } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Closures from './pages/Closures';
import Invoices from './pages/Invoices';
import Cashflow from './pages/Cashflow';
import GSTReport from './pages/GSTReport';

function App() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Closures', path: '/closures', icon: Users },
    { name: 'Invoices', path: '/invoices', icon: FileText },
    { name: 'Cashflow', path: '/cashflow', icon: TrendingUp },
    { name: 'GST Report', path: '/gst', icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h1 className="text-xl font-bold">Recruitment Hub</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Compact Developer Info */}
          <div className="p-3 border-t border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
              <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1">
                <User className="w-3 h-3 text-blue-600" />
                <span>Developed by</span>
              </p>
              <p className="font-bold text-gray-900 text-sm mb-2">Prince Kushwaha</p>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-700">
                  <Phone className="w-3 h-3 text-green-600" />
                  <span>+91 9999631770</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Mail className="w-3 h-3 text-blue-600" />
                  <span className="truncate">princekkushwaha@outlook.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/closures" element={<Closures />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/cashflow" element={<Cashflow />} />
            <Route path="/gst" element={<GSTReport />} />
          </Routes>
        </main>

        {/* Simple Footer */}
        <footer className="py-4 text-center text-sm border-t border-gray-200 bg-gray-50">
          <p className="text-gray-600">© 2024 Recruitment Automation System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
