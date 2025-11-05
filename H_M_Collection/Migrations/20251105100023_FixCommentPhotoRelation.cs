using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace H_M_Collection.Migrations
{
    /// <inheritdoc />
    public partial class FixCommentPhotoRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Photos_PhotoId1",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_PhotoId1",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "PhotoId1",
                table: "Comments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PhotoId1",
                table: "Comments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Comments_PhotoId1",
                table: "Comments",
                column: "PhotoId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Photos_PhotoId1",
                table: "Comments",
                column: "PhotoId1",
                principalTable: "Photos",
                principalColumn: "Id");
        }
    }
}
