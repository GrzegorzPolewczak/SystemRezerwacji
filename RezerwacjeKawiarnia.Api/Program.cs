using Microsoft.EntityFrameworkCore;
using RezerwacjeKawiarnia.Api.Data;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<KawiarniaDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("BazaKawiarni")));

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<KawiarniaDbContext>();

    int maxProby = 5;
    for (int i = 1; i <= maxProby; i++)
    {
        try
        {
            Console.WriteLine($"Próba po³¹czenia z baz¹ ({i}/{maxProby})...");
            dbContext.Database.Migrate();

            if (!dbContext.Stoliki.Any())
            {
                Console.WriteLine("Baza jest pusta. Dodajê testowe stoliki...");
                dbContext.Stoliki.AddRange(
                    new RezerwacjeKawiarnia.Api.Entities.Stolik { Numer = 1, LiczbaMiejsc = 2, CzyZarezerwowany = false },
                    new RezerwacjeKawiarnia.Api.Entities.Stolik { Numer = 2, LiczbaMiejsc = 4, CzyZarezerwowany = false },
                    new RezerwacjeKawiarnia.Api.Entities.Stolik { Numer = 3, LiczbaMiejsc = 6, CzyZarezerwowany = false }
                );
                dbContext.SaveChanges();
            }

            Console.WriteLine("Migracje zakoñczone sukcesem!");
            break;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Baza jeszcze nie wsta³a. Czekam 3 sekundy... B³¹d: {ex.Message}");
            if (i == maxProby) throw;
            System.Threading.Thread.Sleep(3000);
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("FrontendPolicy");

app.MapControllers();

app.Run();

