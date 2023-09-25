namespace API.DTOs;

public class SessionAttendeesDto : SessionDto
{
    public List<AttendeeDto> Attendees { get; set; } = new List<AttendeeDto>();

}
