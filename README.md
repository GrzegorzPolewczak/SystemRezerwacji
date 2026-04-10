# System rezerwacji stolików w kawiarni (SPA)

Aplikacja typu Single Page Application (SPA) stworzona do zarządzania rezerwacjami stolików w kawiarni. Projekt zawiera interfejs dla klientów oraz panel administracyjny dla personelu.

<img width="1018" height="368" alt="image" src="https://github.com/user-attachments/assets/24c9d83c-93a8-4675-9391-9c1cfe10bdf7" />
<img width="1019" height="318" alt="image" src="https://github.com/user-attachments/assets/f0e980a3-74d9-4451-8151-71868ae12ac7" />
<img width="1021" height="604" alt="image" src="https://github.com/user-attachments/assets/ca6031df-f2b8-4c8b-891b-22e93394db42" />

## Kluczowe Funkcje

### Strefa Klienta
* **Wybór stolika:** Wizualna reprezentacja dostępnych stolików.
* **Dostępność w czasie rzeczywistym:** Kliknięcie w dany stolik natychmiast filtruje i wyświetla jego zajęte terminy.
* **Walidacja:** Kalendarz zapobiega wybraniu dat z przeszłości lub popełnieniu błędów logicznych (np. czas zakończenia przed czasem rozpoczęcia).

### Panel Pracownika
* **Edycja w wierszach:** Bezpośrednia edycja szczegółów stolików i rezerwacji z poziomu tabeli.
* **Podwójna walidacja:** Sprawdzanie danych zarówno po stronie klienta, jak i serwera, zapobiegające duplikowaniu numerów stolików czy nakładaniu się rezerwacji.

## Technologie

**Backend (REST API):**
* C# / .NET Core 8+
* Entity Framework Core
* Architektura DTO
* Programowanie asynchroniczne (async/await)

**Frontend (SPA):**
* React.js (zbudowany przy użyciu Vite)
* React Router DOM (Nawigacja po stronie klienta)
* Axios (Klient HTTP do komunikacji z API)
* CSS (Stylowanie inline)

**Infrastruktura & Konteneryzacja:**
* Docker
* Baza danych: MS SQL Server (w kontenerze)
* Serwer WWW frontendu: Nginx (w kontenerze)

## Uruchomienie projektu

Dzięki użyciu Dockera, uruchomienie pełnego środowiska (Baza Danych + API + Frontend) ogranicza się do jednego polecenia, bez konieczności instalacji SDK .NET czy Node.js.

### Wymagania
* Zainstalowany [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Instrukcja
1. Sklonuj to repozytorium:
   ```bash
   git clone https://github.com/GrzegorzPolewczak/SystemRezerwacji.git
   cd SystemRezerwacji-Backend
2. W głównym folderze projektu (tam gdzie leży plik docker-compose.yml) utwórz plik tekstowy o nazwie .env na podstawie pliku env.example i wpisz w nim hasło dla bazy MS SQL:
   ```bash
   DB_PASSWORD=wpisz_tutaj_haslo
3. Zbuduj i uruchom środowisko za pomocą Dockera:
   ```bash
   docker-compose up -d --build
4. Aplikacja kliencka jest dostępna w przeglądarce pod adresem: http://localhost:5173. (Główne API nasłuchuje pod adresem http://localhost:7123)
