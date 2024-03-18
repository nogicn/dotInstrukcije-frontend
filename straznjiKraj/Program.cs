using DotgetPredavanje2.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace DotgetPredavanje2
{
    public class Program
    {
        private static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddRazorPages();
            SetUpDB(builder);
            SetUpJWT(builder);

            var app = builder.Build();

            TestDatabaseConnection(app.Services);

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication(); //has to go before UseAuthorization
            app.UseAuthorization();
            app.MapControllers();
            app.MapRazorPages();
            app.UseStaticFiles();
            app.Run();
        }
        

        private static void SetUpDB(WebApplicationBuilder builder)
        {
            builder.Services.AddDbContext<AppContextExample>(options =>
                            options.UseSqlite(builder.Configuration.GetConnectionString("AppContextExampleConnection")));
        }

        private static void SetUpJWT(WebApplicationBuilder builder)
        {
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            builder.Services.AddAuthorization();
        }

        private async static void TestDatabaseConnection(IServiceProvider services)
        {
            await Task.Delay(3000);

            using (var scope = services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppContextExample>();
                try
                {
                    dbContext.Database.OpenConnection();
                    dbContext.Database.CloseConnection();
                    Console.WriteLine("Database connection successful.");
                    foreach (var user in dbContext.Users.ToList())
                    {
                        Console.WriteLine($"Name: {user.Name}, Username: {user.Username}, ID: {user.ID}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Database connection failed: {ex.Message}");
                }
            }
        }
    }
}