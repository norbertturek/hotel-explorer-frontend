
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://api.turystyka.gov.pl';

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

  const fetchHotelDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/cwoh/${encodeURIComponent(id)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const hotelDetails: HotelDetails = await response.json();
      setData(hotelDetails);
      
      console.log(`Fetched details for hotel ${id}:`, hotelDetails);
    } catch (err) {
      const errorMessage = 'Nie udało się pobrać szczegółów hotelu';
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
  }, [id, toast]);

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
