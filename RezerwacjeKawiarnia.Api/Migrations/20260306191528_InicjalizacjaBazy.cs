using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RezerwacjeKawiarnia.Api.Migrations
{
    /// <inheritdoc />
    public partial class InicjalizacjaBazy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Stoliki",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Numer = table.Column<int>(type: "int", nullable: false),
                    LiczbaMiejsc = table.Column<int>(type: "int", nullable: false),
                    CzyZarezerwowany = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stoliki", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Stoliki");
        }
    }
}
