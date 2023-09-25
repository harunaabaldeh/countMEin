using API.Entities;

namespace API.Extensions;

public static class AttendanceExtension
{
    public static IQueryable<Attendee> SortSessionAttendees(this IQueryable<Attendee> query, string orderBy)
    {
        return orderBy switch
        {
            "attendeeFirstNameAsc" => query.OrderBy(a => a.FirstName),
            "attendeeFirstNameDesc" => query.OrderByDescending(a => a.FirstName),
            "attendeeLastNameAsc" => query.OrderBy(a => a.LastName),
            "attendeeLastNameDesc" => query.OrderByDescending(a => a.LastName),
            "attendeeEmailAsc" => query.OrderBy(a => a.Email),
            "attendeeEmailDesc" => query.OrderByDescending(a => a.Email),
            "attendeeMATNumberAsc" => query.OrderBy(a => a.MATNumber),
            "attendeeMATNumberDesc" => query.OrderByDescending(a => a.MATNumber),
            "attendeeCreatedAtAsc" => query.OrderBy(a => a.CreatedAt),
            "attendeeCreatedAtDesc" => query.OrderByDescending(a => a.CreatedAt),
            _ => query.OrderBy(a => a.FirstName)
        };
    }

    public static IQueryable<Attendee> SearchSessionAttendees(this IQueryable<Attendee> query, string? search)
    {
        return query.Where(a => string.IsNullOrEmpty(search) || a.FirstName.ToLower().Contains(search.ToLower()) || a.LastName.ToLower().Contains(search.ToLower()) || a.Email.ToLower().Contains(search.ToLower()) || a.MATNumber.ToLower().Contains(search.ToLower()));
    }
}
