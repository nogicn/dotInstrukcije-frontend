namespace DotgetPredavanje2.ViewModels;

public class ProfessorUpdateModel
{
    public string Name { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string[] Subjects { get; set; }
    public string ProfilePicture { get; set; }
}