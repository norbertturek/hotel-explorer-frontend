
import { useFetchHotels } from '@/hooks/useFetchHotels';
import { HotelCard } from '@/components/HotelCard';
import { Button } from '@/components/ui/button';
import { Loader2, Download, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface HotelsListProps {
  searchQuery: string;
  filters: {
    wojewodztwo: string;
    powiat: string;
    gmina: string;
    rodzaj: string;
    kategoria: string;
  };
}

export const HotelsList = ({ searchQuery, filters }: HotelsListProps) => {
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  
  const { 
    data, 
    loading, 
    error, 
    totalPages, 
    totalElements,
    refetch,
    exportToCsv 
  } = useFetchHotels({
    searchQuery,
    filters,
    page,
    size
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    exportToCsv();
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Wystąpił błąd</h3>
        <p className="text-gray-600 mb-4">Nie udało się pobrać danych z serwera.</p>
        <Button onClick={refetch} variant="outline">
          Spróbuj ponownie
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Ładowanie hoteli...
            </div>
          ) : (
            `Znaleziono ${totalElements} obiektów`
          )}
        </div>
        
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          disabled={loading || !data?.length}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Eksportuj CSV</span>
        </Button>
      </div>

      {loading && page === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.map((hotel) => (
              <HotelCard key={hotel.uid} hotel={hotel} />
            ))}
          </div>

          {data?.length === 0 && !loading && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Brak wyników
              </h3>
              <p className="text-gray-600">
                Nie znaleziono hoteli spełniających kryteria wyszukiwania.
                Spróbuj zmienić filtry lub wyszukać inną frazę.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 py-6">
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                variant="outline"
                size="sm"
              >
                Poprzednia
              </Button>
              
              <div className="flex space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNumber = Math.max(0, Math.min(page - 2 + i, totalPages - 1));
                  return (
                    <Button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      variant={page === pageNumber ? "default" : "outline"}
                      size="sm"
                      className="w-10"
                    >
                      {pageNumber + 1}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                variant="outline"
                size="sm"
              >
                Następna
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
