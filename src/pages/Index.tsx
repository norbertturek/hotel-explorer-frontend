
import { useState } from 'react';
import { HotelsList } from '@/components/HotelsList';
import { HotelFilters } from '@/components/HotelFilters';
import { SearchBar } from '@/components/SearchBar';
import { Header } from '@/components/Header';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    wojewodztwo: '',
    powiat: '',
    gmina: '',
    rodzaj: '',
    kategoria: ''
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rejestr Obiektów Hotelarskich
          </h1>
          <p className="text-xl text-gray-600">
            Wyszukaj i przeglądaj obiekty noclegowe w Polsce
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Filtry wyszukiwania</h2>
              <SearchBar onSearch={handleSearch} />
              <div className="mt-4">
                <HotelFilters filters={filters} onFiltersChange={handleFiltersChange} />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <HotelsList searchQuery={searchQuery} filters={filters} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
