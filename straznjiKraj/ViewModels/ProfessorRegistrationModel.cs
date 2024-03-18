namespace DotgetPredavanje2.ViewModels;

public class ProfessorRegistrationModel
{
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    
    public string ProfilePicture { get; set; }
    
    public string[] Subjects { get; set; }
}