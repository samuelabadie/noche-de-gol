'use client'

import { AdminPanel } from '@/components/AdminPanel'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="mb-6">
              <img 
                src="/logo.svg" 
                alt="Logo del Torneo" 
                className="mx-auto h-20 w-auto"
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🏆 Panel de Administración
            </h1>
            <p className="text-xl text-gray-600">
              Gestión del torneo de fútbol local
            </p>
          </div>
          
          <AdminPanel />
        </div>
      </div>
    </div>
  )
} 