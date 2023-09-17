using Microsoft.AspNetCore.Identity;

namespace API.Entities;
public class AppUser : IdentityUser
{
    public string DisplayName { get; set; }
    public string? ProfileImageUrl { get; set; }
    public ICollection<Session> AttendantLinks { get; set; } = new List<Session>();

}
