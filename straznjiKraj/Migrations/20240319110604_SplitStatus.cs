using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DotgetPredavanje2.Migrations
{
    /// <inheritdoc />
    public partial class SplitStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "InstructionsDate");

            migrationBuilder.AddColumn<int>(
                name: "StanjeZahtjevaID",
                table: "InstructionsDate",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StanjeZahtjevaID",
                table: "InstructionsDate");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "InstructionsDate",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
