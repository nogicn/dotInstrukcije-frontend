using DotgetPredavanje2.Data;
using DotgetPredavanje2.Models;
using DotgetPredavanje2.Utils;
using DotgetPredavanje2.ViewModels;


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
    public class InstructorController : Controller
    {


        private readonly AppContextExample context;
        private readonly IConfiguration configuration;

        public InstructorController(AppContextExample context, IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration;
        }

        [HttpPost("register/professor")]
        public async Task<IActionResult> Register(ProfessorRegistrationModel model)
        {
            if (ModelState.IsValid)
            {
                var userExists = await context.Users.AnyAsync(u => u.Email == model.Email);
                if (userExists)
                {
                    return BadRequest(new { success = false, message = "User with this email already exists." });
                }
                
                if (model.Subjects.Length > 0 && model.Subjects[0] != "")
                {
                    // if the user is trying to register more then 3 subjects stop him
                    if (model.Subjects[0].Split(",").Length > 3)
                    {
                        return BadRequest(new { success = false, message = "You can't register more then 3 subjects." });
                    }
                    
                    // check if they are duplicates
                    var subjects = model.Subjects[0].Split(",");
                    if (subjects.Distinct().Count() != subjects.Length)
                    {
                        return BadRequest(new { success = false, message = "You can't register duplicate subjects." });
                    }
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
                    Subjects = model.Subjects[0].ToString().Split(","),
                    ProfilePicture = "/profilePictures/" + fileName
                };

                context.Users.Add(user);
                await context.SaveChangesAsync();

                var response = new { success = true, user };
                return Ok(response);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("login/professor")]
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
                professor = new { user.ID, user.Name, user.Surname, user.Email },
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
                new Claim(JwtRegisteredClaimNames.Sub, user.Surname),
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
        [HttpGet("professor/{id}")]
        public async Task<IActionResult> GetUserByID(int id)
        {
            var user = await context.Users.FindAsync(id);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var response = new
            {
                success = true,
                user = new { user.ID, user.Name, user.Surname, user.Email }
            };

            return Ok(response);
        }

        [Authorize]
        [HttpGet("professors")]
        public async Task<IActionResult> GetAllUsers()
        {
            
            // calculate number of instructions where user is professor
            var usersInstructions = await context.InstructionsDate.GroupBy(i => i.ProfessorId).Select(
                g => new { Key = g.Key, Count = g.Count() }).ToDictionaryAsync(i => i.Key, i => i.Count);
            
           // select all suers whre Subjects != null
           var users = await context.Users.Where(u => u.Subjects != null).Select(
               p => new
               {
                   _id = p.ID,
                   p.Name,
                   p.Surname,
                   p.Email,
                   profilePictureUrl = p.ProfilePicture,
                   p.Subjects,
                   instructionsCount = p.InstructionsCount
               }).ToListAsync();
           
           // now swap instructionsCount with the real number of instructions
           var usersWithInstructions = users.Select(u => new
              {
                u._id,
                u.Name,
                u.Surname,
                u.Email,
                u.profilePictureUrl,
                u.Subjects,
                instructionsCount = usersInstructions.ContainsKey(u._id) ? usersInstructions[u._id] : 0
                }).ToList();
            
            return Ok(new { success = true, professors = usersWithInstructions });
        }

        [Authorize]
        [HttpDelete("professor/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await context.Users.FindAsync(id);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            context.Users.Remove(user);
            await context.SaveChangesAsync();

            return Ok(new { success = true, message = $"User with id {id} deleted successfully." });
        }

        [Authorize]
        [HttpPut("professor/{id}")]
        public async Task<IActionResult> UpdateUserById(int id, ProfessorUpdateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // check if password is valid
            if (!PasswordUtils.VerifyPassword(model.PasswordCheck, context.Users.Find(id).Password))
            {
                return Unauthorized(new { success = false, message = "Authentication failed. Incorrect password." });
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
            
            if (model.Password != null)
            {
                user.Password = PasswordUtils.HashPassword(model.Password);
                hasChange = true;
            }
            
            if (model.Subjects != null && model.Subjects.Length > 0 && model.Subjects[0] != "")
            {
                // if the user is trying to register more then 3 subjects stop him
                if (model.Subjects[0].Split(",").Length > 3)
                {
                    return BadRequest(new { success = false, message = "You can't register more then 3 subjects." });
                }
                // check if they are duplicates
                var subjects = model.Subjects[0].Split(",");
                if (subjects.Distinct().Count() != subjects.Length)
                {
                    return BadRequest(new { success = false, message = "You can't register duplicate subjects." });
                }
                user.Subjects = model.Subjects[0]?.Split(",");
                hasChange = true;
            }


            if (hasChange) await context.SaveChangesAsync();

            string message = hasChange ? "User updated successfully." : "No updates on user.";
            return base.Ok(new
                { success = true, message, user = new { user.ID, user.Name, user.Surname, user.Email } });
        }


    }

}