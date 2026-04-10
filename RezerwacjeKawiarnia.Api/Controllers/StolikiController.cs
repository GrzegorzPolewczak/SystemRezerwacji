using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RezerwacjeKawiarnia.Api.Data;
using RezerwacjeKawiarnia.Api.DTOs;
using RezerwacjeKawiarnia.Api.Entities;

namespace RezerwacjeKawiarnia.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StolikiController : ControllerBase
    {
        private readonly KawiarniaDbContext _context;
        public StolikiController(KawiarniaDbContext context) {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StolikDto>>> PobierzWszystkie() {
            var stoliki = await _context.Stoliki
                .Select(s => new StolikDto
                {
                    Id = s.Id,
                    Numer = s.Numer,
                    LiczbaMiejsc = s.LiczbaMiejsc,
                    CzyZarezerwowany = s.CzyZarezerwowany
                })
                .ToListAsync();

            return Ok(stoliki);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StolikDto>> PobierzStolik(int id)
        {
            var stolik = await _context.Stoliki
                .Select(s => new StolikDto
                {
                    Id = s.Id,
                    Numer = s.Numer,
                    LiczbaMiejsc = s.LiczbaMiejsc,
                    CzyZarezerwowany = s.CzyZarezerwowany
                })
                .SingleOrDefaultAsync(s => s.Id == id);

            if (stolik == null)
            {
                return NotFound($"Nie znaleziono stolika o ID {id}.");
            }

            return Ok(stolik);
        }

        [HttpPost]
        public async Task<ActionResult<StolikDto>> DodajStolik(DodajStolikDto dto)
        {
            var czyIstnieje = await _context.Stoliki.AnyAsync(s => s.Numer == dto.Numer);
            if (czyIstnieje)
            {
                return Conflict($"Stolik o numerze {dto.Numer} już istnieje.");
            }

            var nowyStolik = new Stolik
            {
                Numer = dto.Numer,
                LiczbaMiejsc = dto.LiczbaMiejsc,
                CzyZarezerwowany = dto.CzyZarezerwowany
            };

            _context.Stoliki.Add(nowyStolik);
            await _context.SaveChangesAsync();

            var wyjsciowyStolik = new StolikDto
            {
                Id = nowyStolik.Id,
                Numer = nowyStolik.Numer,
                LiczbaMiejsc = nowyStolik.LiczbaMiejsc,
                CzyZarezerwowany = nowyStolik.CzyZarezerwowany
            };

            return CreatedAtAction(nameof(PobierzStolik), new { id = nowyStolik.Id }, wyjsciowyStolik);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EdytujStolik(int id, EdytujStolikDto dto)
        {
            var stolik = await _context.Stoliki.FindAsync(id);
            if (stolik == null)
            {
                return NotFound($"Nie znaleziono stolika o ID {id}.");
            }

            var czyIstnieje = await _context.Stoliki.AnyAsync(s => s.Numer == dto.Numer);
            if(czyIstnieje)
            {
                return Conflict($"Stolik o numerze {dto.Numer} już istnieje.");
            }

            stolik.Numer = dto.Numer;
            stolik.LiczbaMiejsc = dto.LiczbaMiejsc;
            stolik.CzyZarezerwowany = dto.CzyZarezerwowany;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> UsunStolik(int id)
        {
            var stolik = await _context.Stoliki.FindAsync(id);
            if(stolik == null)
            {
                return NotFound($"Nie znaleziono stolika o ID {id}.");
            }

            _context.Stoliki.Remove(stolik);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
