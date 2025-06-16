import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';

interface HotelDetails {
  uid: string;
  rid: string;
  name: string;
  description?: string;
  ownerName?: string;
  registrationDate?: string;
  erasureDate?: string;
  kind: string;
  category: string;
  voivodeship: string;
  district?: string;
  community?: string;
  city: string;
  postalCode?: string;
  street?: string;
  streetNumber?: string;
  phone?: string;
  fax?: string;
  email?: string;
  www?: string;
  location?: string;
  spatialLocation?: {
    type: string;
    coordinates: [number, number];
  };
  bedsNumber?: number;
  housingUnitsNumber?: number;
  servicesRendered?: string;
  disabledPeopleAdapted?: string;
  affiliated?: string;
  suspensionBenefits?: string;
}

interface ApiResponse {
  content: any;
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
      const response = await apiClient.get(`/registers/open/cwoh/${encodeURIComponent(id)}`);
      const apiData: ApiResponse = response.data;
      
      // Mapowanie danych z API na nasz interfejs
      const hotelDetails: HotelDetails = {
        uid: apiData.content.uid,
        rid: apiData.content.rid,
        name: apiData.content.name,
        description: apiData.content.description,
        ownerName: apiData.content.ownerName,
        registrationDate: apiData.content.registrationDate,
        erasureDate: apiData.content.erasureDate,
        kind: apiData.content.kind,
        category: apiData.content.category,
        voivodeship: apiData.content.voivodeship,
        district: apiData.content.district,
        community: apiData.content.community,
        city: apiData.content.city,
        postalCode: apiData.content.postalCode,
        street: apiData.content.street,
        streetNumber: apiData.content.streetNumber,
        phone: apiData.content.phone,
        fax: apiData.content.fax,
        email: apiData.content.email,
        www: apiData.content.www,
        location: apiData.content.location,
        spatialLocation: apiData.content.spatialLocation,
        bedsNumber: apiData.content.bedsNumber,
        housingUnitsNumber: apiData.content.housingUnitsNumber,
        servicesRendered: apiData.content.servicesRendered,
        disabledPeopleAdapted: apiData.content.disabledPeopleAdapted,
        affiliated: apiData.content.affiliated,
        suspensionBenefits: apiData.content.suspensionBenefits
      };
      
      setData(hotelDetails);
      console.log(`Fetched details for hotel ${id}:`, hotelDetails);
    } catch (err) {
      const errorMessage = 'Nie udało się pobrać szczegółów hotelu';
      setError(errorMessage);
      console.error(`Error fetching hotel with ID ${id}:`, err);
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
        `"Nazwa","${hotel.name}"`,
        `"Rodzaj","${hotel.kind}"`,
        `"Kategoria","${hotel.category}"`,
        `"Miejscowość","${hotel.city}"`,
        `"Województwo","${hotel.voivodeship}"`,
        `"Powiat","${hotel.district || ''}"`,
        `"Gmina","${hotel.community || ''}"`,
        `"Adres","${hotel.street || ''}"`,
        `"Kod pocztowy","${hotel.postalCode || ''}"`,
        `"Status","${hotel.suspensionBenefits || ''}"`,
        `"Data decyzji","${hotel.registrationDate || ''}"`,
        `"Telefon","${hotel.phone || ''}"`,
        `"Email","${hotel.email || ''}"`,
        `"WWW","${hotel.www || ''}"`,
        `"Numer ewidencyjny","${hotel.rid || ''}"`,
        `"Numer decyzji","${hotel.suspensionBenefits || ''}"`
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `hotel_${hotel.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
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
