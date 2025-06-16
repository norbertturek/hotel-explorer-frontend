
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
    if (filters.powiat) {
      loadGminy(filters.powiat);
    }
  }, [filters.powiat, loadGminy]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    
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
          <Select value={filters.wojewodztwo} onValueChange={(value) => handleFilterChange('wojewodztwo', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Wybierz województwo" />
            </SelectTrigger>
            <SelectContent>
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
            value={filters.powiat} 
            onValueChange={(value) => handleFilterChange('powiat', value)}
            disabled={!filters.wojewodztwo || loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Wybierz powiat" />
            </SelectTrigger>
            <SelectContent>
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
            value={filters.gmina} 
            onValueChange={(value) => handleFilterChange('gmina', value)}
            disabled={!filters.powiat || loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Wybierz gminę" />
            </SelectTrigger>
            <SelectContent>
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
            <Select value={filters.rodzaj} onValueChange={(value) => handleFilterChange('rodzaj', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wszystkie rodzaje" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="pensjonat">Pensjonat</SelectItem>
                <SelectItem value="motel">Motel</SelectItem>
                <SelectItem value="hostel">Hostel</SelectItem>
                <SelectItem value="aparthotel">Aparthotel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="kategoria" className="text-xs text-gray-600 mb-1 block">
              Kategoria
            </Label>
            <Select value={filters.kategoria} onValueChange={(value) => handleFilterChange('kategoria', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wszystkie kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">⭐ 1 gwiazdka</SelectItem>
                <SelectItem value="2">⭐⭐ 2 gwiazdki</SelectItem>
                <SelectItem value="3">⭐⭐⭐ 3 gwiazdki</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ 4 gwiazdki</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ 5 gwiazdek</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
