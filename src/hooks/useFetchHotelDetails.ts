
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface HotelDetails {
  uid: string;
  nazwa: string;
  rodzaj: string;
  kategoria: string;
  miejscowosc: string;
  wojewodztwo: string;
  powiat?: string;
  gmina?: string;
  adres?: string;
  kodPocztowy?: string;
  status: string;
  dataDecyzji?: string;
  telefon?: string;
  email?: string;
  www?: string;
  opis?: string;
  numerEwidencyjny?: string;
  numerDecyzji?: string;
}

export const useFetchHotelDetails = (id: string) => {
  const [data, setData] = useState<HotelDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateMockHotelDetails = useCallback((hotelId: string): HotelDetails => {
    // Mock data based on ID
    const mockHotels: Record<string, HotelDetails> = {
      '1': {
        uid: '1',
        nazwa: 'Hotel Bristol Warsaw',
        rodzaj: 'hotel',
        kategoria: '5',
        miejscowosc: 'Warszawa',
        wojewodztwo: 'mazowieckie',
        powiat: 'warszawski',
        gmina: 'Warszawa',
        adres: 'ul. Krakowskie Przedmieście 42/44',
        kodPocztowy: '00-325',
        status: 'aktywny',
        dataDecyzji: '2023-01-15',
        telefon: '+48 22 625 25 25',
        email: 'reception@hotelbristol.pl',
        www: 'https://www.hotelbristolwarsaw.pl',
        opis: 'Luksusowy hotel w sercu Warszawy, oferujący najwyższy standard obsługi i komfortu. Położony przy Krakowskim Przedmieściu, w odległości krótkiego spaceru od Starego Miasta i głównych atrakcji turystycznych.',
        numerEwidencyjny: 'CWOIH/WAR/2023/001',
        numerDecyzji: 'DT-I.7020.1.2023'
      },
      '2': {
        uid: '2',
        nazwa: 'Pensjonat Pod Lipami',
        rodzaj: 'pensjonat',
        kategoria: '3',
        miejscowosc: 'Zakopane',
        wojewodztwo: 'małopolskie',
        powiat: 'tatrzański',
        gmina: 'Zakopane',
        adres: 'ul. Krupówki 15',
        kodPocztowy: '34-500',
        status: 'aktywny',
        dataDecyzji: '2023-02-10',
        telefon: '+48 18 201 23 45',
        email: 'info@podlipami.pl',
        opis: 'Rodzinny pensjonat w centrum Zakopanego, oferujący ciepłą atmosferę i regionalną kuchnię. Idealny dla miłośników gór i tradycji góralskiej.',
        numerEwidencyjny: 'CWOIH/ZAK/2023/015',
        numerDecyzji: 'DT-I.7020.15.2023'
      }
    };

    return mockHotels[hotelId] || {
      uid: hotelId,
      nazwa: `Hotel ${hotelId}`,
      rodzaj: 'hotel',
      kategoria: '3',
      miejscowosc: 'Warszawa',
      wojewodztwo: 'mazowieckie',
      status: 'aktywny',
      dataDecyzji: '2023-01-01'
    };
  }, []);

  const fetchHotelDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    
    try {
      // Symulacja API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const hotelDetails = generateMockHotelDetails(id);
      setData(hotelDetails);
      
      console.log(`Fetched details for hotel ${id}:`, hotelDetails);
    } catch (err) {
      const errorMessage = 'Nie udało się pobrać szczegółów hotelu';
      setError(errorMessage);
      toast({
        title: "Błąd",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [id, generateMockHotelDetails, toast]);

  const exportToCsv = useCallback((hotel: HotelDetails) => {
    try {
      const csvContent = [
        'Pole,Wartość',
        `"Nazwa","${hotel.nazwa}"`,
        `"Rodzaj","${hotel.rodzaj}"`,
        `"Kategoria","${hotel.kategoria}"`,
        `"Miejscowość","${hotel.miejscowosc}"`,
        `"Województwo","${hotel.wojewodztwo}"`,
        `"Powiat","${hotel.powiat || ''}"`,
        `"Gmina","${hotel.gmina || ''}"`,
        `"Adres","${hotel.adres || ''}"`,
        `"Kod pocztowy","${hotel.kodPocztowy || ''}"`,
        `"Status","${hotel.status}"`,
        `"Data decyzji","${hotel.dataDecyzji || ''}"`,
        `"Telefon","${hotel.telefon || ''}"`,
        `"Email","${hotel.email || ''}"`,
        `"WWW","${hotel.www || ''}"`,
        `"Numer ewidencyjny","${hotel.numerEwidencyjny || ''}"`,
        `"Numer decyzji","${hotel.numerDecyzji || ''}"`
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `hotel_${hotel.nazwa.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
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
  }, [toast]);

  useEffect(() => {
    fetchHotelDetails();
  }, [fetchHotelDetails]);

  return {
    data,
    loading,
    error,
    exportToCsv
  };
};
