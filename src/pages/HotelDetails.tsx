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
  AlertCircle,
  User,
  Bed,
  Home,
  Accessibility
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

  const getReadableKind = (kind: string) => {
    const kindMap: { [key: string]: string } = {
      'RODZ_HOT': 'Hotel',
      'RODZ_PEN': 'Pensjonat',
      'RODZ_MOT': 'Motel',
      'RODZ_HOS': 'Hostel',
      'RODZ_APH': 'Aparthotel',
      'RODZ_CAM': 'Camping',
      'RODZ_DOM': 'Dom wczasowy',
      'RODZ_OSR': 'Ośrodek wypoczynkowy',
      'RODZ_INN': 'Inne'
    };
    
    return kindMap[kind] || kind;
  };

  const renderStars = (kategoria: string) => {
    // Wyciągamy liczbę gwiazdek z formatu API (np. "KAT_3ST_HOT" -> 3)
    const match = kategoria.match(/(\d+)ST/);
    const stars = match ? parseInt(match[1]) : 0;
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Brak danych';
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  const getYesNoLabel = (value?: string) => {
    if (value === 'TAK') return 'Tak';
    if (value === 'NIE') return 'Nie';
    return value || 'Brak danych';
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
                      {hotel.name}
                    </CardTitle>
                    <div className="flex items-center text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      <span className="capitalize">{getReadableKind(hotel.kind)}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800" variant="secondary">
                    Aktywny
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotel.category && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Kategoria</h4>
                      {renderStars(hotel.category)}
                    </div>
                  )}
                  
                  {hotel.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Opis</h4>
                      <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
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
                  <p className="text-gray-900 font-medium">
                    {hotel.street && hotel.streetNumber ? `${hotel.street} ${hotel.streetNumber}` : hotel.street || 'Brak danych'}
                  </p>
                  <p className="text-gray-600">
                    {hotel.postalCode && `${hotel.postalCode} `}
                    {hotel.city}
                  </p>
                  <p className="text-gray-600">
                    {hotel.district && `Powiat ${hotel.district}, `}
                    {hotel.voivodeship}
                  </p>
                  {hotel.location && (
                    <p className="text-gray-500 text-sm">
                      Lokalizacja: {hotel.location}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Dodatkowe informacje */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Informacje o obiekcie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {hotel.bedsNumber && (
                    <div className="flex items-center">
                      <Bed className="w-6 h-6 mr-3 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Liczba łóżek</p>
                        <p className="text-sm text-gray-600">{hotel.bedsNumber}</p>
                      </div>
                    </div>
                  )}
                  
                  {hotel.housingUnitsNumber && (
                    <div className="flex items-center">
                      <Home className="w-6 h-6 mr-3 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Liczba pokoi</p>
                        <p className="text-sm text-gray-600">{hotel.housingUnitsNumber}</p>
                      </div>
                    </div>
                  )}
                  
                  {hotel.disabledPeopleAdapted && (
                    <div className="flex items-center">
                      <Accessibility className="w-6 h-6 mr-3 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Dostosowany dla niepełnosprawnych</p>
                        <p className="text-sm text-gray-600">{getYesNoLabel(hotel.disabledPeopleAdapted)}</p>
                      </div>
                    </div>
                  )}
                  
                  {hotel.affiliated && (
                    <div className="flex items-center">
                      <Building className="w-6 h-6 mr-3 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Obiekt stowarzyszony</p>
                        <p className="text-sm text-gray-600">{getYesNoLabel(hotel.affiliated)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Kontakt */}
            <Card>
              <CardHeader>
                <CardTitle>Kontakt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotel.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    <a
                      href={`tel:${hotel.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {hotel.phone}
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
                      href={hotel.www.startsWith('http') ? hotel.www : `https://${hotel.www}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {hotel.www}
                    </a>
                  </div>
                )}

                {!hotel.phone && !hotel.email && !hotel.www && (
                  <p className="text-gray-500 text-sm italic">
                    Brak danych kontaktowych
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Właściciel */}
            {hotel.ownerName && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Właściciel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 font-medium">{hotel.ownerName}</p>
                </CardContent>
              </Card>
            )}

            {/* Informacje administracyjne */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Informacje administracyjne
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotel.registrationDate && (
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 mr-3 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Data rejestracji</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(hotel.registrationDate)}
                      </p>
                    </div>
                  </div>
                )}
                
                {hotel.rid && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Numer ewidencyjny</p>
                    <p className="text-sm text-gray-600 font-mono">{hotel.rid}</p>
                  </div>
                )}
                
                {hotel.suspensionBenefits && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status świadczeń</p>
                    <p className="text-sm text-gray-600">{getYesNoLabel(hotel.suspensionBenefits)}</p>
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
