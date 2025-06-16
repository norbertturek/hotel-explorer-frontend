# TurystykaHotele - Rejestr Obiektów Hotelarskich

Oficjalna aplikacja do przeglądania rejestru obiektów hotelarskich CWOIH (Centralna Wiedza o Obiektach Hotelarskich) udostępnianego przez Ministerstwo Sportu i Turystyki.

## Opis projektu

Aplikacja umożliwia wyszukiwanie i przeglądanie obiektów hotelarskich w Polsce na podstawie danych z oficjalnego API turystyka.gov.pl. Użytkownicy mogą filtrować hotele według województwa, powiatu, gminy, rodzaju obiektu i kategorii.

## Funkcjonalności

- **Wyszukiwanie hoteli** - wyszukiwanie po nazwie z automatycznym podpowiadaniem
- **Filtrowanie** - według województwa, powiatu, gminy, rodzaju obiektu i kategorii
- **Paginacja** - przeglądanie wyników z podziałem na strony
- **Szczegóły hotelu** - pełne informacje o obiekcie, kontakt, lokalizacja
- **Eksport danych** - możliwość eksportu danych do CSV
- **Responsywny design** - dostosowany do urządzeń mobilnych

## Technologie

- **React 18** z TypeScript
- **Vite** - narzędzie do budowania
- **Tailwind CSS** - stylowanie
- **shadcn/ui** - komponenty UI
- **React Query** - zarządzanie stanem i cache'owaniem
- **React Router** - routing
- **Axios** - komunikacja z API

## Instalacja i uruchomienie

```bash
# Klonowanie repozytorium
git clone <URL_REPOZYTORIUM>

# Przejście do katalogu projektu
cd hotel-explorer-frontend

# Instalacja zależności
yarn install

# Uruchomienie w trybie deweloperskim
yarn dev

# Budowanie do produkcji
yarn build
```

## API

Aplikacja korzysta z oficjalnego API Ministerstwa Sportu i Turystyki:
- **Endpoint główny**: `https://api.turystyka.gov.pl/registers/open/cwoh`
- **Dokumentacja**: Dostępna na stronie api.turystyka.gov.pl

## Kontakt

**Ministerstwo Sportu i Turystyki**
- Telefon: 22 266 32 64
- Email: kontakt@msit.gov.pl
- Infolinia dla Obywatela: 222 500 138

## Licencja

Projekt wykorzystuje dane publiczne udostępniane przez Ministerstwo Sportu i Turystyki.
