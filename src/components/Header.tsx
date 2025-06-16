
import { MapPin, Phone, Mail } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-md border-b-2 border-blue-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-2">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TurystykaHotele</h1>
              <p className="text-sm text-gray-600">Oficjalny rejestr CWOIH</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm">Infolinia: 22 123 45 67</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="text-sm">info@turystyka.gov.pl</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
