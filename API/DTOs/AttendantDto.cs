using API.Entities;

namespace API.DTOs;

public class AttendantDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string MATNumber { get; set; }
    public string Token { get; set; }
    public string SessionName { get; set; }

}
