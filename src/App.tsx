import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { ServiceCard } from './components/ServiceCard';
import { AddServiceModal } from './components/AddServiceModal';
import { LoginPage } from './components/LoginPage';
import type { Service } from './types';

export function App() {
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const addService = (newService: Omit<Service, 'id' | 'lastCheck' | 'isActive'>) => {
    const service: Service = {
      ...newService,
      id: crypto.randomUUID(),
      lastCheck: new Date(),
      isActive: false,
    };
    setServices([...services, service]);
    checkService(service.id);
  };

  const checkService = async (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    try {
      const response = await fetch(service.url, { mode: 'no-cors' });
      const isActive = response.type === 'opaque' || response.ok;
      
      setServices(services.map(s => 
        s.id === id ? { ...s, isActive, lastCheck: new Date() } : s
      ));
    } catch (error) {
      setServices(services.map(s => 
        s.id === id ? { ...s, isActive: false, lastCheck: new Date() } : s
      ));
    }
  };

  const checkAllServices = () => {
    services.forEach(service => checkService(service.id));
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Monitor</h1>
            <p className="mt-2 text-gray-600">Track and monitor your services in one place</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 bg-white rounded-md border hover:bg-gray-50"
            >
              Logout
            </button>
            <button
              onClick={checkAllServices}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-md border hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              Check All
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services added yet</h3>
            <p className="text-gray-500">Add your first service to start monitoring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onCheck={checkService}
              />
            ))}
          </div>
        )}

        <AddServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addService}
        />
      </div>
    </div>
  );
}