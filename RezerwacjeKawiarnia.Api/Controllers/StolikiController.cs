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

        [HttpPost]
        public async Task<ActionResult> DodajStolik(Stolik nowyStolik)
        {
            _context.Stoliki.Add(nowyStolik);
            await _context.SaveChangesAsync();
            return Ok(nowyStolik);
        }
    }
}
