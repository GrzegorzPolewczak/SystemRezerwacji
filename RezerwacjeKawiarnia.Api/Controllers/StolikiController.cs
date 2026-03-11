using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RezerwacjeKawiarnia.Api.Data;
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
        public async Task<ActionResult<IEnumerable<Stolik>>> PobierzWszystkie() {
            var stoliki = await _context.Stoliki.ToListAsync();
            return Ok(stoliki);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Stolik>> PobierzStolik(int id)
        {
            var stolik = await _context.Stoliki.FindAsync(id);
            if (stolik == null)
            {
                return NotFound($"Nie znaleziono stolika o ID {id}.");
            }

            return Ok(stolik);
        }

        [HttpPost]
        public async Task<ActionResult<Stolik>> DodajStolik(Stolik nowyStolik)
        {
            _context.Stoliki.Add(nowyStolik);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(PobierzStolik), new { id = nowyStolik.Id }, nowyStolik);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Stolik>> EdytujStolik(int id, Stolik zaktualizowanyStolik)
        {
            if (id != zaktualizowanyStolik.Id) 
            {
                return BadRequest("ID wybranego stolika, nie są zgodne z ID zaktualizowanego stolika.");
            }

            var stolik = await _context.Stoliki.FindAsync(id);
            if (stolik == null)
            {
                return NotFound($"Nie znaleziono stolika o ID {id}.");
            }

            stolik.Numer = zaktualizowanyStolik.Numer;
            stolik.LiczbaMiejsc = zaktualizowanyStolik.LiczbaMiejsc;
            stolik.CzyZarezerwowany = zaktualizowanyStolik.CzyZarezerwowany;

            await _context.SaveChangesAsync();

            return Ok(stolik);
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
