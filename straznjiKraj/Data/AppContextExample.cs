using DotgetPredavanje2.Models;
using Microsoft.EntityFrameworkCore;

namespace DotgetPredavanje2.Data
{
    public class AppContextExample : DbContext
    {
        public AppContextExample(DbContextOptions<AppContextExample> options)
            : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(@"Data Source=E:\SQLite\dotget.db");
        }

        public DbSet<User> Users { get; set; }
        public DbSet<DotgetPredavanje2.Models.Subject> Subject { get; set; } = default!;
        public DbSet<DotgetPredavanje2.Models.InstructionsDate> InstructionsDate { get; set; } = default!;
    }
}
