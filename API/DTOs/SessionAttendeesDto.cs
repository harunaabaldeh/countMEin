using API.Entities;

namespace API.DTOs;

public class SessionAttendeesDto : SessionDto
{
    public List<Attendee> Attendees { get; set; } = new List<Attendee>();

}
