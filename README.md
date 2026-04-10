# System rezerwacji stolików w kawiarni (SPA)

Aplikacja typu Single Page Application (SPA) stworzona do zarządzania rezerwacjami stolików w kawiarni. Projekt zawiera interfejs dla klientów oraz panel administracyjny dla personelu.

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

***Frontend (SPA):***
* React.js (zbudowany przy użyciu Vite)
* React Router DOM (Nawigacja po stronie klienta)
* Axios (Klient HTTP do komunikacji z API)
* CSS (Stylowanie inline)
