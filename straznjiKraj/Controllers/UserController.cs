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
    [Route("api")]
    public class UsersController : Controller
    {
        private readonly AppContextExample context;
        private readonly IConfiguration configuration;

        public UsersController(AppContextExample context, IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration;
        }

        [HttpPost("register/student")]
        public async Task<IActionResult> Register(UserRegistrationModel model)
        {
            if (ModelState.IsValid)
            {
                var userExists = await context.Users.AnyAsync(u => u.Email == model.Email);
                if (userExists)
                {
                    return BadRequest(new { success = false, message = "User with this email already exists." });
                }
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.ProfilePicture.FileName);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/profilePictures", fileName);
                

                using (var stream = System.IO.File.Create(filePath))
                {
                    await model.ProfilePicture.CopyToAsync(stream);
                }
                var user = new User
                {
                    Name = model.Name,
                    Surname = model.Surname,
                    Email = model.Email,
                    Password = PasswordUtils.HashPassword(model.Password),
                    ProfilePicture = "/profilePictures/" + fileName
                };

                context.Users.Add(user);
                await context.SaveChangesAsync();

                var response = new { success = true, user };
                return Ok(response);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("login/student")]
        public async Task<IActionResult> Login(UserLoginModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            User? user = null;

            if (!string.IsNullOrWhiteSpace(model.Email))
            {
                if (RegexUtils.IsValidEmail(model.Email))
                    user = await context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
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
                student = new { user.ID, user.Name, user.Surname, user.Email },
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
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("ID", user.ID.ToString()),
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /*[Authorize]
        [HttpGet("student/{id}")]
        public async Task<IActionResult> GetUserByID(int id)
        {
            var user = await context.Users.FindAsync(id);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var response = new
            {
                success = true,
                student = new { user.ID, user.Name, user.Surname, user.Email }
            };

            return Ok(response);
        }*/
        
        // get student by email
        [Authorize]
        [HttpGet("student/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null) return NotFound(new { success = false, message = "User not found." });
            
            // get all instructions for user
            var instructions = await context.InstructionsDate.Where(i => i.StudentId == user.ID).ToListAsync();
            
            // all subjects
            var subjects = await context.Subject.ToListAsync();

            var response = new
            {
                success = true,
                student = new { user.ID, user.Name, user.Surname, user.Email, profilePictureUrl = user.ProfilePicture, subjects = subjects, description = user.Subjects },
                sentInstructionsRequests = instructions.Where(i => i.StanjeZahtjevaID == 1).ToList(),
                upcomingInstructions = instructions.Where(i => i.StanjeZahtjevaID == 2).ToList(),
                pastInstructions = instructions.Where(i => i.StanjeZahtjevaID == 3).ToList(),
                message = "User found."
            };

            return Ok(response);
        }

        [Authorize]
        [HttpGet("students")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await context.Users
                .Select(user => new {
                    user.ID,
                    user.Name,
                    user.Surname,
                    user.Email
                    
                })
                .ToListAsync();

            return Ok(new { success = true, users });
        }

        [Authorize]
        [HttpDelete("student/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await context.Users.FindAsync(id);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            context.Users.Remove(user);
            await context.SaveChangesAsync();

            return Ok(new { success = true, message = $"User with id {id} deleted successfully." });
        }

        [Authorize]
        [HttpPut("student/{id}")]
        public async Task<IActionResult> UpdateUserById(int id, UserUpdateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            if (model.Password != null)
            {
                // check if password is valid
                if (!PasswordUtils.VerifyPassword(model.Password, context.Users.Find(id).Password))
                {
                    return Unauthorized(new { success = false, message = "Authentication failed. Incorrect password." });
                }
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

            if (model.Surname != null && model.Surname != user.Surname)
            {
                user.Surname = model.Surname;
                hasChange = true;
            }
            
            if (model.ProfilePicture != null && model.ProfilePicture.FileName != user.ProfilePicture)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.ProfilePicture.FileName);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/profilePictures", fileName);

                using (var stream = System.IO.File.Create(filePath))
                {
                    await model.ProfilePicture.CopyToAsync(stream);
                }
                user.ProfilePicture = "/profilePictures/" + fileName;
                hasChange = true;
            }
            
           

            if (hasChange) await context.SaveChangesAsync();

           
            
            string message = hasChange ? "User updated successfully." : "No updates on user.";
            return base.Ok(new { success = true, message, user = new { user.ID, user.Name, user.Surname, user.Email, user.Subjects } });
        }
    }
}
