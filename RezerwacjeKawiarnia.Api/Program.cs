using Microsoft.EntityFrameworkCore;
using RezerwacjeKawiarnia.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<KawiarniaDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("BazaKawiarni")));

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();

