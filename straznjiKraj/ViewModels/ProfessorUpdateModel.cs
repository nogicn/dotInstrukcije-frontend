namespace DotgetPredavanje2.ViewModels;

public class ProfessorUpdateModel
{
    public string? Name { get; set; }
    public string? Surname { get; set; }
    public string? Email { get; set; }
    public IFormFile? ProfilePicture { get; set; }
        
    public string? Password { get; set; }
    public string PasswordCheck { get; set; }
        
    public string[]? Subjects { get; set; }
}