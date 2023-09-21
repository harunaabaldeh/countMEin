namespace API.Entities
{
    public class RefereshLinkToken
    {
        public int Id { get; set; }
        public Guid SessionId { get; set; }
        public Session Session { get; set; }
        public string Token { get; set; }
        public DateTime Expires { get; set; }

        public bool IsExpired => DateTime.UtcNow >= Expires;

        public DateTime? Revoked { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;
    }
}