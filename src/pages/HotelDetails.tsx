
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchHotelDetails } from '@/hooks/useFetchHotelDetails';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Building,
  Star,
  FileText,
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';

const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: hotel, loading, error, exportToCsv } = useFetchHotelDetails(id!);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleExport = () => {
    if (hotel) {
      exportToCsv(hotel);
    }
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
            className={`w-5 h-5 ${
              i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        {stars > 0 && <span className="ml-2 text-gray-600">({stars} gwiazdek)</span>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Ładowanie szczegółów hotelu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel nie został znaleziony</h2>
            <p className="text-gray-600 mb-6">Sprawdź poprawność adresu lub spróbuj ponownie.</p>
            <Button onClick={handleGoBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do listy hoteli
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button onClick={handleGoBack} variant="outline" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do listy
          </Button>
          
          <Button onClick={handleExport} className="flex items-center bg-gradient-to-r from-blue-600 to-green-600">
            <Download className="w-4 h-4 mr-2" />
            Eksportuj do CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Podstawowe informacje */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">
                      {hotel.nazwa}
                    </CardTitle>
                    <div className="flex items-center text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      <span className="capitalize">{hotel.rodzaj}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(hotel.status)} variant="secondary">
                    {hotel.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotel.kategoria && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Kategoria</h4>
                      {renderStars(hotel.kategoria)}
                    </div>
                  )}
                  
                  {hotel.opis && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Opis</h4>
                      <p className="text-gray-600 leading-relaxed">{hotel.opis}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Adres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Lokalizacja
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">{hotel.adres || 'Brak danych'}</p>
                  <p className="text-gray-600">
                    {hotel.kodPocztowy && `${hotel.kodPocztowy} `}
                    {hotel.miejscowosc}
                  </p>
                  <p className="text-gray-600">
                    {hotel.powiat && `Powiat ${hotel.powiat}, `}
                    {hotel.wojewodztwo}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Kontakt */}
            <Card>
              <CardHeader>
                <CardTitle>Kontakt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotel.telefon && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    <a
                      href={`tel:${hotel.telefon}`}
                      className="text-blue-600 hover:underline"
                    >
                      {hotel.telefon}
                    </a>
                  </div>
                )}
                
                {hotel.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <a
                      href={`mailto:${hotel.email}`}
                      className="text-blue-600 hover:underline break-all"
                    >
                      {hotel.email}
                    </a>
                  </div>
                )}
                
                {hotel.www && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-3 text-gray-400" />
                    <a
                      href={hotel.www}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {hotel.www}
                    </a>
                  </div>
                )}

                {!hotel.telefon && !hotel.email && !hotel.www && (
                  <p className="text-gray-500 text-sm italic">
                    Brak danych kontaktowych
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Informacje administracyjne */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Informacje administracyjne
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotel.dataDecyzji && (
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 mr-3 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Data decyzji</p>
                      <p className="text-sm text-gray-600">
                        {new Date(hotel.dataDecyzji).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  </div>
                )}
                
                {hotel.numerEwidencyjny && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Numer ewidencyjny</p>
                    <p className="text-sm text-gray-600 font-mono">{hotel.numerEwidencyjny}</p>
                  </div>
                )}
                
                {hotel.numerDecyzji && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Numer decyzji</p>
                    <p className="text-sm text-gray-600 font-mono">{hotel.numerDecyzji}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
