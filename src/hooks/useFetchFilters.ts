import { useState, useCallback } from 'react';
import apiClient from '@/lib/api';

// Statyczna lista województw w Polsce
const WOJEWODZTWA = [
  'Dolnośląskie',
  'Kujawsko-pomorskie', 
  'Lubelskie',
  'Lubuskie',
  'Łódzkie',
  'Małopolskie',
  'Mazowieckie',
  'Opolskie',
  'Podkarpackie',
  'Podlaskie',
  'Pomorskie',
  'Śląskie',
  'Świętokrzyskie',
  'Warmińsko-mazurskie',
  'Wielkopolskie',
  'Zachodniopomorskie'
];

export const useFetchFilters = () => {
  const [powiaty, setPowiaty] = useState<string[]>([]);
  const [gminy, setGminy] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPowiaty = useCallback(async (wojewodztwo: string) => {
    if (!wojewodztwo) {
      setPowiaty([]);
      return;
    }

    setLoading(true);
    try {
      // Pobieramy hotele z danego województwa i wyciągamy unikalne powiaty
      const response = await apiClient.get('/registers/open/cwoh', {
        params: {
          voivodeship: wojewodztwo,
          size: 1000 // Pobieramy więcej rekordów aby mieć pełną listę powiatów
        }
      });
      
      const hotels = response.data.content || [];
      const uniquePowiaty = [...new Set(
        hotels
          .map((hotel: any) => hotel.district)
          .filter((district: string) => district && district.trim() !== '')
      )].sort();
      
      setPowiaty(uniquePowiaty);
      setGminy([]); // Reset gmin when wojewodztwo changes
      console.log('Fetched powiaty for', wojewodztwo, ':', uniquePowiaty);
    } catch (error) {
      console.error('Error fetching powiaty:', error);
      setPowiaty([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGminy = useCallback(async (wojewodztwo: string, powiat: string) => {
    if (!wojewodztwo || !powiat) {
      setGminy([]);
      return;
    }

    setLoading(true);
    try {
      // Pobieramy hotele z danego województwa i powiatu i wyciągamy unikalne gminy
      const response = await apiClient.get('/registers/open/cwoh', {
        params: {
          voivodeship: wojewodztwo,
          // Uwaga: API może nie mieć parametru 'district', sprawdzimy w dokumentacji
          size: 1000
        }
      });
      
      const hotels = response.data.content || [];
      const uniqueGminy = [...new Set(
        hotels
          .filter((hotel: any) => hotel.district === powiat)
          .map((hotel: any) => hotel.community)
          .filter((community: string) => community && community.trim() !== '')
      )].sort();
      
      setGminy(uniqueGminy);
      console.log('Fetched gminy for', powiat, ':', uniqueGminy);
    } catch (error) {
      console.error('Error fetching gminy:', error);
      setGminy([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    wojewodztwa: WOJEWODZTWA,
    powiaty,
    gminy,
    loading,
    loadPowiaty,
    loadGminy
  };
};
