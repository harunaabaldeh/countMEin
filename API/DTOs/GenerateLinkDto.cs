namespace API.DTOs;

public class GenerateLinkDto
{
    public string SessionName { get; set; }
    public DateTime SessionExpiresAt { get; set; }
    public DateTime LinkExpiresAt { get; set; }
}
