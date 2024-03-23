using System.Security.Claims;
using DotgetPredavanje2.Data;
using DotgetPredavanje2.Models;
using DotgetPredavanje2.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DotgetPredavanje2.Controllers
{

    [ApiController]
    [Route("api")]
    public class SubjectController : Controller
    {
        private readonly AppContextExample context;
        private readonly IConfiguration configuration;
        
        public SubjectController(AppContextExample context, IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration;
        }

        [Authorize]
        [HttpPost("subject")]
        public async Task<IActionResult> CreateSubject(SubjectCreateModel model)
        {
            // Validate the model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // check if url aready exists in the database
            var urlExists = await context.Subject.AnyAsync(s => s.Url == model.Url);
            if (urlExists)
            {
                return BadRequest(new { success = false, message = "Subject with this URL already exists." });
            }

            // Create a new Subject entity
            var subject = new Subject
            {
                Title = model.Title,
                Url = model.Url,
                Description = model.Description
            };

            // Add the new Subject to the database context
            context.Subject.Add(subject);

            // Save the changes to the database
            var result = await context.SaveChangesAsync();

            // Return a success response if the operation was successful, or an error response if it was not
            return result > 0
                ? Ok(new { success = true, message = "Subject created successfully." })
                : StatusCode(StatusCodes.Status500InternalServerError,
                    new { success = false, message = "An error occurred while creating the subject." });
        }

        [Authorize]
        [HttpGet("subject/{url}")]
        public async Task<IActionResult> GetSubjectByUrl(string url)
        {
            // Query the database for a subject with the provided URL
            var subject = await context.Subject.FirstOrDefaultAsync(s => s.Url == url);

            // If a subject is found, return a success response with the subject data and associated professors
            if (subject != null)
            {
        
                // get all professors
                var professors = await context.Users.Where(u => u.Subjects != null).Select(
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
                
                // check if professor has subject equal to subject url
                professors = professors != null ? professors.Where(p => p.Subjects.Contains(url)).ToList() : null;
                // print every subject that professor has
                
                return Ok(new
                {
                    success = true,
                    subject = new { subject.Title, subject.Url, subject.Description },
                    professors,
                    message = "Subject found."
                });
            }

            // If no subject is found, return an error response indicating that the subject was not found
            return NotFound(new { success = false, message = "Subject not found." });
        }

        
        [HttpGet("subjects")]
        public async Task<IActionResult> GetAllSubjects()
        {
            // Query the database to retrieve all subjects
            var subjects = await context.Subject.Select(
                s => new
                {
                    s.Title,
                    s.Url,
                    s.Description
                }).ToListAsync();


            // Return a success response with the list of subjects
            return Ok(new { success = true, subjects });
        }

        [Authorize]
        [HttpPost("instructions")]
        public async Task<IActionResult> ScheduleInstructionSession(InstructionSessionModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            
            // check if user has subjects
            if (user.Subjects == null)
            {
                // get all instructions for user that are still active with todays date and time
                var instructions = await context.InstructionsDate
                    .Where(i => i.StudentId == user.ID && i.DateTime > DateTime.Now).ToListAsync();
                if (instructions.Count > 4)
                {
                    return BadRequest(new { success = false, message = "Maksimalno možete imati 3 aktivna datuma instrukcija!" });
                }
                
            }
            
            if (user == null) return NotFound(new { success = false, message = "Student not found." });

            if (model.ProfessorId == 0) return BadRequest(new { success = false, message = "Professor not found." });
            
            var studentID = user.ID;
            var professorID = model.ProfessorId;
            
            if (user.Subjects != null)
            {
                studentID = model.ProfessorId;
                professorID = user.ID;
            }
            
            var exists = await context.InstructionsDate.FirstOrDefaultAsync(i => i.StudentId == studentID && i.ProfessorId == professorID);
            
            if (exists != null)
            {

                if (model.Date != null) exists.DateTime = model.Date;
                
                context.InstructionsDate.Update(exists);
            }
            else
            {
                // Create a new InstructionSession entity
                var instructionSession = new InstructionsDate
                {
                    DateTime = model.Date,
                    ProfessorId = model.ProfessorId,
                    StudentId = user.ID,
                    StanjeZahtjevaID = 1
               
                
                };
                // Add the new InstructionSession to the database context
                context.InstructionsDate.Add(instructionSession);
            }

            

            // Save the changes to the database
            var result = await context.SaveChangesAsync();

            // Return a success response if the operation was successful, or an error response if it was not
            return result > 0
                ? Ok(new { success = true, message = "Instruction session scheduled successfully." })
                : StatusCode(StatusCodes.Status500InternalServerError,
                    new { success = false, message = "An error occurred while scheduling the instruction session." });
        }
        
        [Authorize]
        [HttpGet("instructions")]
        public async Task<IActionResult> GetInstructionSessions()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            var instructions = await context.InstructionsDate.Where(i => i.ProfessorId == user.ID || i.StudentId == user.ID).Select(
                i => new
                {
                    i.ID,
                    i.StudentId,
                    i.ProfessorId,
                    i.DateTime,
                    i.StanjeZahtjevaID
                }).ToListAsync();
            if (instructions.Count == 0) return NotFound(new { success = false, message = "No instructions found." });

            
            if (user.Subjects == null)
            {
                
                var professors = await context.Users.Where(u => u.Subjects != null ).Select(
                    p => new
                    {
                        _id = p.ID,
                        p.Name,
                        p.Surname,
                        p.Email,
                        profilePictureUrl = p.ProfilePicture,
                        p.Subjects,
                        instructionsCount = p.InstructionsCount,
                    }).ToListAsync();
            
                var tmp = new List<ProfessorWithTime>();
                foreach (var i in instructions)
                {
                    var professor = professors.FirstOrDefault(p => p._id == i.ProfessorId);
                    if (professor != null)
                    {
                        var prof = new ProfessorWithTime
                        {
                            _id = professor._id,
                            Name = professor.Name,
                            Surname = professor.Surname,
                            Email = professor.Email,
                            Time = i.DateTime,
                            ProfilePictureUrl = professor.profilePictureUrl,
                            Subjects = professor.Subjects
                        };
                        tmp.Add(prof);
                    }
                }
                
                var professorsSent = tmp.Where(p => p.Time > DateTime.Now).ToList();
                //var professorsPast = tmp.Where(p => instructions.Any(i => i.ProfessorId == p._id && i.StanjeZahtjevaID == 3)).ToList();
                //get users where the date is past today
                var professorsPast = tmp.Where(p => p.Time < DateTime.Now).ToList();
                return Ok(new { success = true, 
                    sentInstructionRequests = professorsSent,
                    pastInstructions = professorsPast
                });
            }
            
            
            
            // tu krece za profesora
           
            var users = await context.Users.Where(u => u.Subjects == null ).Select(
                p => new
                {
                    _id = p.ID,
                    p.Name,
                    p.Surname,
                    p.Email,
                    profilePictureUrl = p.ProfilePicture,
                }).ToListAsync();
            
            
            
            var tmp2 = new List<ProfessorWithTime>();
            foreach (var i in instructions)
            {
                var student = users.FirstOrDefault(p => p._id == i.StudentId);
                if (student != null)
                {
                    var prof = new ProfessorWithTime
                    {
                        ID = student._id,
                        _id = student._id,
                        Name = student.Name,
                        Surname = student.Surname,
                        Email = student.Email,
                        Subjects = user.Subjects,
                        Time = i.DateTime,
                        ProfilePictureUrl = student.profilePictureUrl
                    };
                    tmp2.Add(prof);
                }
            }
            
            var studentSent = tmp2.Where(p => p.Time > DateTime.Now).ToList();
            
            //var studentPast = tmp2.Where(p => instructions.Any(i => i.StudentId == p._id && i.StanjeZahtjevaID == 3)).ToList();
            //get users where the date is past today
            var studentPast = tmp2.Where(p  => p.Time < DateTime.Now).ToList();
            return Ok(new { success = true, 
                upcomingInstructions = studentSent,
                pastInstructions = studentPast
            });
        }
        

    }
}