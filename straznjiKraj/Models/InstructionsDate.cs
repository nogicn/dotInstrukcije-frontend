namespace DotgetPredavanje2.Models;

public class InstructionsDate
{
    public int ID { get; set; }
    public int StudentId { get; set; }
    public int ProfessorId { get; set; }
    public DateTime DateTime { get; set; }
    public string Status { get; set; }
}