namespace API.Entities;
public class Attendant
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string MATNumber { get; set; }
    public Guid AttendantLinkId { get; set; }
    public AttendantLink AttendantLink { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


}
