using System.ComponentModel.DataAnnotations;

namespace RezerwacjeKawiarnia.Api.Entities
{
    public class Stolik
    {
        public int Id { get; set; }
        [Required(ErrorMessage ="Numer stolika jest wymagany.")]
        [Range(1,int.MaxValue, ErrorMessage = "Numer stolika musi być dodatni.")]
        public int Numer { get; set; }
        [Required(ErrorMessage = "Liczba miejsc jest wymagana.")]
        [Range(1,int.MaxValue, ErrorMessage = "Liczba miejsc musi być dodatnia.")]
        public int LiczbaMiejsc {  get; set; }
        public bool CzyZarezerwowany { get; set; }

        public ICollection<Rezerwacja> Rezerwacje { get; set; } = new List<Rezerwacja>();
    }
}
