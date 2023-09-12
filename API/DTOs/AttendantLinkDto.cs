namespace API.DTOs;

public class AttendantLinkDto : GenerateLinkDto
{
    public string SessionId { get; set; }
    public string HostName { get; set; }
    public string Token { get; set; } = string.Empty;

}
