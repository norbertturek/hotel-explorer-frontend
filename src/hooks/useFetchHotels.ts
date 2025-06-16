
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

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

  // Mock data - w rzeczywistej aplikacji zastąpić wywołaniami API
  const generateMockHotels = useCallback((params: FetchHotelsParams): HotelsResponse => {
    const mockHotels: Hotel[] = [
      {
        uid: '1',
        nazwa: 'Hotel Bristol Warsaw',
        rodzaj: 'hotel',
        kategoria: '5',
        miejscowosc: 'Warszawa',
        wojewodztwo: 'mazowieckie',
        status: 'aktywny',
        dataDecyzji: '2023-01-15',
        telefon: '+48 22 625 25 25',
        www: 'https://www.hotelbristolwarsaw.pl'
      },
      {
        uid: '2',
        nazwa: 'Pensjonat Pod Lipami',
        rodzaj: 'pensjonat',
        kategoria: '3',
        miejscowosc: 'Zakopane',
        wojewodztwo: 'małopolskie',
        status: 'aktywny',
        dataDecyzji: '2023-02-10',
        telefon: '+48 18 201 23 45'
      },
      {
        uid: '3',
        nazwa: 'Hotel Mercure Gdańsk',
        rodzaj: 'hotel',
        kategoria: '4',
        miejscowosc: 'Gdańsk',
        wojewodztwo: 'pomorskie',
        status: 'aktywny',
        dataDecyzji: '2023-03-05',
        www: 'https://www.mercure.com'
      },
      {
        uid: '4',
        nazwa: 'Hostel Moon',
        rodzaj: 'hostel',
        kategoria: '2',
        miejscowosc: 'Kraków',
        wojewodztwo: 'małopolskie',
        status: 'zawieszony',
        dataDecyzji: '2023-01-20'
      },
      {
        uid: '5',
        nazwa: 'Hotel Grand Wrocław',
        rodzaj: 'hotel',
        kategoria: '4',
        miejscowosc: 'Wrocław',
        wojewodztwo: 'dolnośląskie',
        status: 'aktywny',
        dataDecyzji: '2023-04-12',
        telefon: '+48 71 123 45 67',
        www: 'https://www.grandwroclaw.pl'
      },
      {
        uid: '6',
        nazwa: 'Motel Drogowiec',
        rodzaj: 'motel',
        kategoria: '2',
        miejscowosc: 'Łódź',
        wojewodztwo: 'łódzkie',
        status: 'aktywny',
        dataDecyzji: '2023-02-28'
      }
    ];

    // Filtrowanie
    let filteredHotels = mockHotels.filter(hotel => {
      if (params.searchQuery && !hotel.nazwa.toLowerCase().includes(params.searchQuery.toLowerCase())) {
        return false;
      }
      if (params.filters.wojewodztwo && hotel.wojewodztwo !== params.filters.wojewodztwo) {
        return false;
      }
      if (params.filters.rodzaj && hotel.rodzaj !== params.filters.rodzaj) {
        return false;
      }
      if (params.filters.kategoria && hotel.kategoria !== params.filters.kategoria) {
        return false;
      }
      return true;
    });

    // Duplikowanie danych dla symulacji większej liczby wyników
    const extendedHotels = [...Array(10)].flatMap((_, i) => 
      filteredHotels.map(hotel => ({
        ...hotel,
        uid: `${hotel.uid}-${i}`,
        nazwa: `${hotel.nazwa} ${i > 0 ? `(${i + 1})` : ''}`
      }))
    );

    const totalCount = extendedHotels.length;
    const startIndex = params.page * params.size;
    const endIndex = startIndex + params.size;
    const paginatedHotels = extendedHotels.slice(startIndex, endIndex);

    return {
      content: paginatedHotels,
      totalElements: totalCount,
      totalPages: Math.ceil(totalCount / params.size),
      number: params.page,
      size: params.size
    };
  }, []);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Symulacja API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = generateMockHotels({ searchQuery, filters, page, size });
      
      setData(response.content);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
      
      console.log(`Fetched ${response.content.length} hotels (page ${page + 1}/${response.totalPages})`);
    } catch (err) {
      const errorMessage = 'Nie udało się pobrać listy hoteli';
      setError(errorMessage);
      toast({
        title: "Błąd",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, page, size, generateMockHotels, toast]);

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
