namespace RezerwacjeKawiarnia.Api.Entities
{
    public class Stolik
    {
        public int Id { get; set; } // Klucz główny
        public int Numer { get; set; } // Numer stolika
        public int LiczbaMiejsc {  get; set; } // Liczba miejsc przy stoliku
        public bool CzyZarezerwowany { get; set; } // Status
    }
}
