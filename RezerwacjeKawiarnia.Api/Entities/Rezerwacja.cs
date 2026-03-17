using System.ComponentModel.DataAnnotations;

namespace RezerwacjeKawiarnia.Api.Entities
{
    public class Rezerwacja
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Imię klienta jest wymagane.")]
        [MaxLength(50)]
        public string Imie { get; set; }
        [Required(ErrorMessage = "Nazwisko klienta jest wymagane.")]
        [MaxLength(50)]
        public string Nazwisko { get; set; }
        [Required]
        public DateTime DataOd { get; set; }
        [Required]
        public DateTime DataDo { get; set; }
        [Required(ErrorMessage = "Podaj ID stolika.")]
        public int StolikId { get; set; }

        public Stolik Stolik { get; set; }

    }
}
