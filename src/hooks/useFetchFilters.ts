
import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';

export const useFetchFilters = () => {
  const [wojewodztwa, setWojewodztwa] = useState<string[]>([]);
  const [powiaty, setPowiaty] = useState<string[]>([]);
  const [gminy, setGminy] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWojewodztwa = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/registers/open/cwoh/wojewodztwa');
        const data = response.data;
        setWojewodztwa(Array.isArray(data) ? data : []);
        console.log('Fetched wojewodztwa:', data);
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
      const response = await apiClient.get(`/registers/open/cwoh/powiaty/${encodeURIComponent(wojewodztwo)}`);
      const data = response.data;
      setPowiaty(Array.isArray(data) ? data : []);
      setGminy([]); // Reset gmin when wojewodztwo changes
      console.log('Fetched powiaty for', wojewodztwo, ':', data);
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
      const response = await apiClient.get(`/registers/open/cwoh/gminy/${encodeURIComponent(powiat)}`);
      const data = response.data;
      setGminy(Array.isArray(data) ? data : []);
      console.log('Fetched gminy for', powiat, ':', data);
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
