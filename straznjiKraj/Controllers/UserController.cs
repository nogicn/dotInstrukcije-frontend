using DotgetPredavanje2.Data;
using DotgetPredavanje2.Models;
using DotgetPredavanje2.Utils;
using DotgetPredavanje2.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DotgetPredavanje2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly AppContextExample context;
        private readonly IConfiguration configuration;

        public UsersController(AppContextExample context, IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new User
                {
                    Name = model.Name,
                    Username = model.Username,
                    Email = model.Email,
                    Password = PasswordUtils.HashPassword(model.Password)
                };

                context.Users.Add(user);
                await context.SaveChangesAsync();

                var response = new { success = true, user };
                return Ok(response);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            User? user = null;

            if (!string.IsNullOrWhiteSpace(model.Login))
            {
                if (RegexUtils.IsValidEmail(model.Login))
                    user = await context.Users.FirstOrDefaultAsync(u => u.Email == model.Login);
                else 
                    user = await context.Users.FirstOrDefaultAsync(u => u.Username == model.Login);
            }

            if (user == null)
            {
                return Unauthorized(new { success = false, message = "Authentication failed. User not found." });
            }

            var passwordIsValid = PasswordUtils.VerifyPassword(model.Password, user.Password);
            if (!passwordIsValid)
            {
                return Unauthorized(new { success = false, message = "Authentication failed. Incorrect password." });
            }

            var token = GenerateJwtToken(user);

            var response = new
            {
                success = true,
                message = "Login successful",
                user = new { user.ID, user.Name, user.Username, user.Email },
                token
            };

            return Ok(response);
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("id", user.ID.ToString()),
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserByID(int id)
        {
            var user = await context.Users.FindAsync(id);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var response = new
            {
                success = true,
                user = new { user.ID, user.Name, user.Username, user.Email }
            };

            return Ok(response);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await context.Users
                .Select(user => new {
                    user.ID,
                    user.Name,
                    user.Username,
                    user.Email
                })
                .ToListAsync();

            return Ok(new { success = true, users });
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await context.Users.FindAsync(id);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            context.Users.Remove(user);
            await context.SaveChangesAsync();

            return Ok(new { success = true, message = $"User with id {id} deleted successfully." });
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserById(int id, UserUpdateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound(new { success = false, message = "User not found." });

            bool hasChange = false;

            if (model.Name != null && model.Name != user.Name)
            {
                user.Name = model.Name;
                hasChange = true;
            }

            if (model.Email != null && model.Email != user.Email)
            {
                user.Email = model.Email;
                hasChange = true;
            }

            if (model.Username != null && model.Username != user.Username)
            {
                user.Username = model.Username;
                hasChange = true;
            }

            if (hasChange) await context.SaveChangesAsync();

            string message = hasChange ? "User updated successfully." : "No updates on user.";
            return base.Ok(new { success = true, message, user = new { user.ID, user.Name, user.Username, user.Email } });
        }
    }
}
