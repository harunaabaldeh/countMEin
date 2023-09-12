namespace API.Entities;
public class AttendantLink
{
    public Guid Id { get; set; }
    public string HostId { get; set; }
    public AppUser Host { get; set; }
    public string SessionName { get; set; }
    public DateTime SessionExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Attendant> Attendants { get; set; } = new List<Attendant>();

    public List<RefereshLinkToken> RefereshLinkTokens { get; set; } = new List<RefereshLinkToken>();
}