using System.ComponentModel.DataAnnotations;

namespace RezerwacjeKawiarnia.Api.Entities
{
    public class Stolik
    {
        public int Id { get; set; } // Klucz główny
        [Required(ErrorMessage ="Numer stolika jest wymagany.")]
        [Range(1,int.MaxValue, ErrorMessage = "Numer stolika musi być dodatni.")]
        public int Numer { get; set; } // Numer stolika
        [Required(ErrorMessage = "Liczba miejsc jest wymagana.")]
        [Range(1,int.MaxValue, ErrorMessage = "Liczba miejsc musi być dodatnia.")]
        public int LiczbaMiejsc {  get; set; } // Liczba miejsc przy stoliku
        public bool CzyZarezerwowany { get; set; } // Status
    }
}
