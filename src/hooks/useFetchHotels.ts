
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';

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

  const buildParams = useCallback((params: FetchHotelsParams) => {
    const searchParams: any = {
      page: params.page,
      size: params.size,
    };
    
    // Wyszukiwanie po nazwie
    if (params.searchQuery) {
      searchParams.nazwa = params.searchQuery;
    }
    
    // Filtry
    if (params.filters.wojewodztwo) {
      searchParams.wojewodztwo = params.filters.wojewodztwo;
    }
    if (params.filters.powiat) {
      searchParams.powiat = params.filters.powiat;
    }
    if (params.filters.gmina) {
      searchParams.gmina = params.filters.gmina;
    }
    if (params.filters.rodzaj) {
      searchParams.rodzaj = params.filters.rodzaj;
    }
    if (params.filters.kategoria) {
      searchParams.kategoria = params.filters.kategoria;
    }
    
    return searchParams;
  }, []);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = buildParams({ searchQuery, filters, page, size });
      console.log('Fetching hotels with params:', params);
      
      const response = await apiClient.get('/registers/open/cwoh', { params });
      const responseData: HotelsResponse = response.data;
      
      setData(responseData.content || []);
      setTotalElements(responseData.totalElements || 0);
      setTotalPages(responseData.totalPages || 0);
      
      console.log(`Fetched ${responseData.content?.length || 0} hotels (page ${page + 1}/${responseData.totalPages || 1})`);
    } catch (err) {
      const errorMessage = 'Nie udało się pobrać listy hoteli';
      setError(errorMessage);
      console.error('Error fetching hotels:', err);
      toast({
        title: "Błąd",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, page, size, buildParams, toast]);

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
