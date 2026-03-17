using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RezerwacjeKawiarnia.Api.Data;
using RezerwacjeKawiarnia.Api.DTOs;
using RezerwacjeKawiarnia.Api.Entities;

namespace RezerwacjeKawiarnia.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RezerwacjeController : ControllerBase
    {
        private readonly KawiarniaDbContext _context;

        public RezerwacjeController(KawiarniaDbContext context)
        {
            _context = context;
        }

        // GET: api/Rezerwacje
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RezerwacjaDto>>> GetRezerwacje()
        {
            var rezerwacje = await _context.Rezerwacje
                .Include(r => r.Stolik)
                .Select(r => new RezerwacjaDto
                {
                    Id = r.Id,
                    Imie = r.Imie,
                    Nazwisko = r.Nazwisko,
                    DataOd = r.DataOd,
                    DataDo = r.DataDo,
                    StolikId = r.StolikId,
                    NumerStolika = r.Stolik.Numer
                })
                .ToListAsync();

            return Ok(rezerwacje);
        }

        // GET: api/Rezerwacje/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RezerwacjaDto>> GetRezerwacja(int id)
        {
            var rezerwacja = await _context.Rezerwacje.
                Include(r => r.Stolik)
                .Select(r => new RezerwacjaDto
                {
                    Id = r.Id,
                    Imie = r.Imie,
                    Nazwisko = r.Nazwisko,
                    DataOd = r.DataOd,
                    DataDo = r.DataDo,
                    StolikId = r.StolikId,
                    NumerStolika = r.Stolik.Numer
                })
                .SingleOrDefaultAsync(r => r.Id == id);

            if (rezerwacja == null)
            {
                return NotFound();
            }

            return Ok(rezerwacja);
        }

        // PUT: api/Rezerwacje/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> EdytujRezerwacja(int id, EdytujRezerwacjeDto dto)
        {
            if (dto.DataOd >= dto.DataDo)
            {
                return BadRequest("Data zakończenia rezerwacji musi być późniejsza niż data rozpoczęcia.");
            }

            var rezerwacjaWBazie = await _context.Rezerwacje.FindAsync(id);
            if(rezerwacjaWBazie == null)
            {
                return NotFound($"Nie znaleziono rezerwacji o ID {id}");
            }
           
            var stolikIstnieje = await _context.Stoliki.AnyAsync(s => s.Id == dto.StolikId);

            if (!stolikIstnieje)
            {
                return BadRequest($"Nie można utworzyć rezerwacji. Stolik o ID {dto.StolikId} nie istnieje.");
            }

            var czyZajety = await _context.Rezerwacje.AnyAsync(r => 
                        r.StolikId == dto.StolikId && 
                        r.Id != id &&
                        dto.DataOd < r.DataDo &&
                        dto.DataDo > r.DataOd
                        );

            if (czyZajety)
            {
                return Conflict("Wybrany stolik jest już zajęty w podanym przedziale czasowym.");
            }

            rezerwacjaWBazie.Imie = dto.Imie;
            rezerwacjaWBazie.Nazwisko = dto.Nazwisko;
            rezerwacjaWBazie.DataOd = dto.DataOd;
            rezerwacjaWBazie.DataDo = dto.DataDo;
            rezerwacjaWBazie.StolikId = dto.StolikId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Rezerwacje
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RezerwacjaDto>> DodajRezerwacja(DodajRezerwacjeDto dto)
        {
            if (dto.DataOd >= dto.DataDo)
            {
                return BadRequest("Data zakończenia rezerwacji musi być późniejsza niż data rozpoczęcia.");
            }

            var stolik = await _context.Stoliki.FindAsync(dto.StolikId);

            if (stolik == null)
            {
                return BadRequest($"Nie można utworzyć rezerwacji. Stolik o ID {dto.StolikId} nie istnieje.");
            }

            var czyZajety = await _context.Rezerwacje.AnyAsync(r =>
                        r.StolikId == dto.StolikId &&
                        dto.DataOd < r.DataDo &&
                        dto.DataDo > r.DataOd
                        );

            if(czyZajety)
            {
                return Conflict("Wybrany stolik jest już zajęty w podanym przedziale czasowym.");
            }

            var nowaRezerwacja = new Rezerwacja
            {
                Imie = dto.Imie,
                Nazwisko = dto.Nazwisko,
                DataOd = dto.DataOd,
                DataDo = dto.DataDo,
                StolikId = dto.StolikId
            };

            _context.Rezerwacje.Add(nowaRezerwacja);
            await _context.SaveChangesAsync();

            var wyjsciowaRezerwacja = new RezerwacjaDto
            {
                Id = nowaRezerwacja.Id,
                Imie = nowaRezerwacja.Imie,
                Nazwisko = nowaRezerwacja.Nazwisko,
                DataOd = nowaRezerwacja.DataOd,
                DataDo = nowaRezerwacja.DataDo,
                StolikId = nowaRezerwacja.StolikId,
                NumerStolika = stolik.Numer
            };

            return CreatedAtAction(nameof(GetRezerwacja), new { id = nowaRezerwacja.Id }, wyjsciowaRezerwacja);
        }

        // DELETE: api/Rezerwacje/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRezerwacja(int id)
        {
            var rezerwacja = await _context.Rezerwacje.FindAsync(id);
            if (rezerwacja == null)
            {
                return NotFound();
            }

            _context.Rezerwacje.Remove(rezerwacja);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
