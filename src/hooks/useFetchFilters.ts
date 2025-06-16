
import { useState, useEffect, useCallback } from 'react';

export const useFetchFilters = () => {
  const [wojewodztwa, setWojewodztwa] = useState<string[]>([]);
  const [powiaty, setPowiaty] = useState<string[]>([]);
  const [gminy, setGminy] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Symulacja danych - w rzeczywistej aplikacji to będą wywołania API
  const mockWojewodztwa = [
    'dolnośląskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie',
    'łódzkie', 'małopolskie', 'mazowieckie', 'opolskie',
    'podkarpackie', 'podlaskie', 'pomorskie', 'śląskie',
    'świętokrzyskie', 'warmińsko-mazurskie', 'wielkopolskie', 'zachodniopomorskie'
  ];

  const mockPowiaty: Record<string, string[]> = {
    'mazowieckie': ['warszawski', 'krakowski', 'gdański', 'wrocławski'],
    'małopolskie': ['krakowski', 'tarnowski', 'nowosądecki'],
    'pomorskie': ['gdański', 'słupski', 'wejherowski'],
    'śląskie': ['katowicki', 'częstochowski', 'bielski']
  };

  const mockGminy: Record<string, string[]> = {
    'warszawski': ['Warszawa', 'Pruszków', 'Piaseczno', 'Legionowo'],
    'krakowski': ['Kraków', 'Wieliczka', 'Skawina'],
    'gdański': ['Gdańsk', 'Sopot', 'Pruszcz Gdański']
  };

  useEffect(() => {
    // Inicjalne załadowanie województw
    const fetchWojewodztwa = async () => {
      setLoading(true);
      try {
        // Symulacja API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setWojewodztwa(mockWojewodztwa);
      } catch (error) {
        console.error('Error fetching wojewodztwa:', error);
        setWojewodztwa([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWojewodztwa();
  }, []);

  const loadPowiaty = useCallback(async (wojewodztwo: string) => {
    if (!wojewodztwo) {
      setPowiaty([]);
      return;
    }

    setLoading(true);
    try {
      // Symulacja API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setPowiaty(mockPowiaty[wojewodztwo] || []);
      setGminy([]); // Reset gmin when wojewodztwo changes
    } catch (error) {
      console.error('Error fetching powiaty:', error);
      setPowiaty([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGminy = useCallback(async (powiat: string) => {
    if (!powiat) {
      setGminy([]);
      return;
    }

    setLoading(true);
    try {
      // Symulacja API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setGminy(mockGminy[powiat] || []);
    } catch (error) {
      console.error('Error fetching gminy:', error);
      setGminy([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    wojewodztwa,
    powiaty,
    gminy,
    loading,
    loadPowiaty,
    loadGminy
  };
};
