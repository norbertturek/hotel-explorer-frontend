
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://api.turystyka.gov.pl';

interface Hotel {
  uid: string;
  nazwa: string;
  rodzaj: string;
  kategoria: string;
  miejscowosc: string;
  wojewodztwo: string;
  status: string;
  dataDecyzji?: string;
  telefon?: string;
  www?: string;
}

interface FetchHotelsParams {
  searchQuery: string;
  filters: {
    wojewodztwo: string;
    powiat: string;
    gmina: string;
    rodzaj: string;
    kategoria: string;
  };
  page: number;
  size: number;
}

interface HotelsResponse {
  content: Hotel[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const useFetchHotels = ({ searchQuery, filters, page, size }: FetchHotelsParams) => {
  const [data, setData] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  const buildApiUrl = useCallback((params: FetchHotelsParams): string => {
    const url = new URL(`${API_BASE_URL}/api/cwoh`);
    
    // Paginacja
    url.searchParams.append('page', params.page.toString());
    url.searchParams.append('size', params.size.toString());
    
    // Wyszukiwanie po nazwie
    if (params.searchQuery) {
      url.searchParams.append('nazwa', params.searchQuery);
    }
    
    // Filtry
    if (params.filters.wojewodztwo) {
      url.searchParams.append('wojewodztwo', params.filters.wojewodztwo);
    }
    if (params.filters.powiat) {
      url.searchParams.append('powiat', params.filters.powiat);
    }
    if (params.filters.gmina) {
      url.searchParams.append('gmina', params.filters.gmina);
    }
    if (params.filters.rodzaj) {
      url.searchParams.append('rodzaj', params.filters.rodzaj);
    }
    if (params.filters.kategoria) {
      url.searchParams.append('kategoria', params.filters.kategoria);
    }
    
    return url.toString();
  }, []);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = buildApiUrl({ searchQuery, filters, page, size });
      console.log('Fetching hotels from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData: HotelsResponse = await response.json();
      
      setData(responseData.content || []);
      setTotalElements(responseData.totalElements || 0);
      setTotalPages(responseData.totalPages || 0);
      
      console.log(`Fetched ${responseData.content?.length || 0} hotels (page ${page + 1}/${responseData.totalPages || 1})`);
    } catch (err) {
      const errorMessage = 'Nie udało się pobrać listy hoteli';
      setError(errorMessage);
      console.error('API Error:', err);
      toast({
        title: "Błąd",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, page, size, buildApiUrl, toast]);

  const exportToCsv = useCallback(() => {
    try {
      const csvContent = [
        'Nazwa,Rodzaj,Kategoria,Miejscowość,Województwo,Status,Data decyzji,Telefon,WWW',
        ...data.map(hotel => [
          hotel.nazwa,
          hotel.rodzaj,
          hotel.kategoria,
          hotel.miejscowosc,
          hotel.wojewodztwo,
          hotel.status,
          hotel.dataDecyzji || '',
          hotel.telefon || '',
          hotel.www || ''
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `hotele_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Eksport zakończony",
        description: "Plik CSV został pobrany pomyślnie"
      });
    } catch (err) {
      toast({
        title: "Błąd eksportu",
        description: "Nie udało się wyeksportować danych",
        variant: "destructive"
      });
    }
  }, [data, toast]);

  const refetch = useCallback(() => {
    fetchHotels();
  }, [fetchHotels]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return {
    data,
    loading,
    error,
    totalElements,
    totalPages,
    refetch,
    exportToCsv
  };
};
