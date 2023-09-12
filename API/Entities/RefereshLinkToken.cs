namespace API.Entities
{
    public class RefereshLinkToken
    {
        public int Id { get; set; }
        public Guid AttendantLinkId { get; set; }
        public AttendantLink AttendantLink { get; set; }
        public string Token { get; set; }
        public DateTime Expires { get; set; } = DateTime.UtcNow.AddMinutes(10);

        public bool IsExpired => DateTime.UtcNow >= Expires;

        public DateTime? Revoked { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;
    }
}