namespace DotgetPredavanje2.Models
{
    public class User
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        
        public string ProfilePicture { get; set; }

        public int InstructionsCount { get; set; }
        public string[] Subjects { get; set; }
    }
}
