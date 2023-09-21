using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;
public class AppUser : IdentityUser
{
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }
    public string ProfileImageUrl { get; set; }
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
    public ICollection<RefereshAppUserToken> RefreshAppUserTokens { get; set; } = new List<RefereshAppUserToken>();

}
