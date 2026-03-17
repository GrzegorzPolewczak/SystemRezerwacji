namespace RezerwacjeKawiarnia.Api.DTOs
{
    public class RezerwacjaDto
    {
        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public DateTime DataOd { get; set; }
        public DateTime DataDo { get; set; }
        public int StolikId { get; set; }
        public int NumerStolika { get; set; }
    }
}
