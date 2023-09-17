namespace API.DTOs;

public class SessionDto : CreateSessionDto
{
    public string SessionId { get; set; }
    public string HostName { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime LinkExpiresAt { get; set; }

}
