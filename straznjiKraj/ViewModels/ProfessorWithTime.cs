namespace DotgetPredavanje2.ViewModels;

public class ProfessorWithTime
{
    public int _id { get; set; }
    public int ID { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    
    public string ProfilePictureUrl { get; set; }
    
    public string[] Subjects { get; set; }
    
    public DateTime Time { get; set; }
    
    public int InstructionsCount { get; set; }
}