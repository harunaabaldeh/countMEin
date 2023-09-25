using API.Entities;

namespace API.Extensions;

public static class SessionExtension
{
    public static IQueryable<Session> SortSessions(this IQueryable<Session> query, string orderBy)
    {
        return orderBy switch
        {
            "sessionNameAsc" => query.OrderBy(s => s.SessionName),
            "sessionNameDesc" => query.OrderByDescending(s => s.SessionName),
            "sessionCreatedAtAsc" => query.OrderBy(s => s.CreatedAt),
            "sessionCreatedAtDesc" => query.OrderByDescending(s => s.CreatedAt),
            "sessionExpiresAtAsc" => query.OrderBy(s => s.SessionExpiresAt),
            "sessionExpiresAtDesc" => query.OrderByDescending(s => s.SessionExpiresAt),
            "attendeesCountAsc" => query.OrderBy(s => s.Attendees.Count),
            "attendeesCountDesc" => query.OrderByDescending(s => s.Attendees.Count),
            _ => query.OrderBy(s => s.SessionName)
        };
    }

    public static IQueryable<Session> SearchSessions(this IQueryable<Session> query, string? search) => query.Where(s =>
        string.IsNullOrEmpty(search)
    || s.SessionName.ToLower().Contains(search.ToLower())
    || s.Attendees.Count.ToString().Contains(search.ToLower())
    || s.CreatedAt.ToString().Contains(search.ToLower())
    || s.SessionExpiresAt.ToString().Contains(search.ToLower()));
}
