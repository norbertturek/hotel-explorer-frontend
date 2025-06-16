import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useFetchFilters } from '@/hooks/useFetchFilters';

interface Filters {
  wojewodztwo: string;
  powiat: string;
  gmina: string;
  rodzaj: string;
  kategoria: string;
}

interface HotelFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export const HotelFilters = ({ filters, onFiltersChange }: HotelFiltersProps) => {
  const { wojewodztwa, powiaty, gminy, loadPowiaty, loadGminy, loading } = useFetchFilters();

  useEffect(() => {
    if (filters.wojewodztwo) {
      loadPowiaty(filters.wojewodztwo);
    }
  }, [filters.wojewodztwo, loadPowiaty]);

  useEffect(() => {
    if (filters.powiat && filters.wojewodztwo) {
      loadGminy(filters.wojewodztwo, filters.powiat);
    }
  }, [filters.powiat, filters.wojewodztwo, loadGminy]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    // Konwertuj "all" na pusty string dla API
    const apiValue = value === "all" ? "" : value;
    const newFilters = { ...filters, [key]: apiValue };
    
    // Reset dependent filters
    if (key === 'wojewodztwo') {
      newFilters.powiat = '';
      newFilters.gmina = '';
    }
    if (key === 'powiat') {
      newFilters.gmina = '';
    }
    
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    onFiltersChange({
      wojewodztwo: '',
      powiat: '',
      gmina: '',
      rodzaj: '',
      kategoria: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">Lokalizacja</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Wyczyść
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="wojewodztwo" className="text-xs text-gray-600 mb-1 block">
            Województwo
          </Label>
          <Select value={filters.wojewodztwo || "all"} onValueChange={(value) => handleFilterChange('wojewodztwo', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Wszystkie województwa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie województwa</SelectItem>
              {wojewodztwa.map((woj) => (
                <SelectItem key={woj} value={woj}>
                  {woj}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="powiat" className="text-xs text-gray-600 mb-1 block">
            Powiat
          </Label>
          <Select 
            value={filters.powiat || "all"} 
            onValueChange={(value) => handleFilterChange('powiat', value)}
            disabled={!filters.wojewodztwo || loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Wszystkie powiaty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie powiaty</SelectItem>
              {powiaty.map((pow) => (
                <SelectItem key={pow} value={pow}>
                  {pow}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gmina" className="text-xs text-gray-600 mb-1 block">
            Gmina
          </Label>
          <Select 
            value={filters.gmina || "all"} 
            onValueChange={(value) => handleFilterChange('gmina', value)}
            disabled={!filters.powiat || loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Wszystkie gminy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie gminy</SelectItem>
              {gminy.map((gmina) => (
                <SelectItem key={gmina} value={gmina}>
                  {gmina}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <Label className="text-sm font-medium mb-3 block">Typ obiektu</Label>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="rodzaj" className="text-xs text-gray-600 mb-1 block">
              Rodzaj
            </Label>
            <Select value={filters.rodzaj || "all"} onValueChange={(value) => handleFilterChange('rodzaj', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wszystkie rodzaje" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie rodzaje</SelectItem>
                <SelectItem value="RODZ_HOT">Hotel</SelectItem>
                <SelectItem value="RODZ_PEN">Pensjonat</SelectItem>
                <SelectItem value="RODZ_MOT">Motel</SelectItem>
                <SelectItem value="RODZ_HOS">Hostel</SelectItem>
                <SelectItem value="RODZ_APH">Aparthotel</SelectItem>
                <SelectItem value="RODZ_CAM">Camping</SelectItem>
                <SelectItem value="RODZ_DOM">Dom wczasowy</SelectItem>
                <SelectItem value="RODZ_OSR">Ośrodek wypoczynkowy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="kategoria" className="text-xs text-gray-600 mb-1 block">
              Ocena (gwiazdki)
            </Label>
            <Select value={filters.kategoria || "all"} onValueChange={(value) => handleFilterChange('kategoria', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wszystkie oceny" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie oceny</SelectItem>
                <SelectItem value="KAT_1ST_HOT">⭐ 1 gwiazdka</SelectItem>
                <SelectItem value="KAT_2ST_HOT">⭐⭐ 2 gwiazdki</SelectItem>
                <SelectItem value="KAT_3ST_HOT">⭐⭐⭐ 3 gwiazdki</SelectItem>
                <SelectItem value="KAT_4ST_HOT">⭐⭐⭐⭐ 4 gwiazdki</SelectItem>
                <SelectItem value="KAT_5ST_HOT">⭐⭐⭐⭐⭐ 5 gwiazdek</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
