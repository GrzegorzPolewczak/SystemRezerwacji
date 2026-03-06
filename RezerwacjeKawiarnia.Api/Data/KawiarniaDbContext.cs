using Microsoft.EntityFrameworkCore;
using RezerwacjeKawiarnia.Api.Entities;

namespace RezerwacjeKawiarnia.Api.Data
{
    public class KawiarniaDbContext : DbContext
    {
        public KawiarniaDbContext(DbContextOptions<KawiarniaDbContext> options) : base(options) { }

        public DbSet<Stolik> Stoliki { get; set; }
    }
}
