namespace API.RequestHelpers;

public class SessionAttendeeParams : PaginationParams
{
    public string? SearchTerm { get; set; }
    public string? OrderBy { get; set; }
}
