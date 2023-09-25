namespace API.RequestHelpers;

public class SessionParams : PaginationParams
{
    public string? SearchTerm { get; set; }
    public string? OrderBy { get; set; }

}
