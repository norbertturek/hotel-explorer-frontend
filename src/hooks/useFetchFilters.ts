
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'https://api.turystyka.gov.pl';

export const useFetchFilters = () => {
  const [wojewodztwa, setWojewodztwa] = useState<string[]>([]);
  const [powiaty, setPowiaty] = useState<string[]>([]);
  const [gminy, setGminy] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWojewodztwa = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/cwoh/wojewodztwa`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/cwoh/powiaty/${encodeURIComponent(wojewodztwo)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/cwoh/gminy/${encodeURIComponent(powiat)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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
