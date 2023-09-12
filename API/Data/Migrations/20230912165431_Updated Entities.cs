using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendants_AttendantLinks_AttendantLinkId",
                table: "Attendants");

            migrationBuilder.RenameColumn(
                name: "SessionExpiration",
                table: "AttendantLinks",
                newName: "SessionExpiresAt");

            migrationBuilder.AlterColumn<Guid>(
                name: "AttendantLinkId",
                table: "Attendants",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Attendants",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddForeignKey(
                name: "FK_Attendants_AttendantLinks_AttendantLinkId",
                table: "Attendants",
                column: "AttendantLinkId",
                principalTable: "AttendantLinks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendants_AttendantLinks_AttendantLinkId",
                table: "Attendants");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Attendants");

            migrationBuilder.RenameColumn(
                name: "SessionExpiresAt",
                table: "AttendantLinks",
                newName: "SessionExpiration");

            migrationBuilder.AlterColumn<Guid>(
                name: "AttendantLinkId",
                table: "Attendants",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendants_AttendantLinks_AttendantLinkId",
                table: "Attendants",
                column: "AttendantLinkId",
                principalTable: "AttendantLinks",
                principalColumn: "Id");
        }
    }
}
