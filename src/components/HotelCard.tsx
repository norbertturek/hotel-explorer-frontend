
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/hotel/${hotel.uid}`);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aktywny':
        return 'bg-green-100 text-green-800';
      case 'zawieszony':
        return 'bg-yellow-100 text-yellow-800';
      case 'wykreślony':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (kategoria: string) => {
    const stars = parseInt(kategoria) || 0;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        {stars > 0 && <span className="ml-1 text-sm text-gray-600">({stars})</span>}
      </div>
    );
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {hotel.nazwa}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {hotel.miejscowosc}, {hotel.wojewodztwo}
            </div>
          </div>
          <Badge className={getStatusColor(hotel.status)}>
            {hotel.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Rodzaj: </span>
            <span className="text-sm text-gray-600 capitalize">{hotel.rodzaj}</span>
          </div>
          {hotel.kategoria && renderStars(hotel.kategoria)}
        </div>

        {hotel.dataDecyzji && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Data decyzji: {new Date(hotel.dataDecyzji).toLocaleDateString('pl-PL')}</span>
          </div>
        )}

        <div className="flex items-center space-x-4 text-sm">
          {hotel.telefon && (
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-1" />
              <span>{hotel.telefon}</span>
            </div>
          )}
          {hotel.www && (
            <div className="flex items-center text-blue-600">
              <Globe className="w-4 h-4 mr-1" />
              <a
                href={hotel.www}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Strona www
              </a>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleViewDetails}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          Zobacz szczegóły
        </Button>
      </CardFooter>
    </Card>
  );
};
