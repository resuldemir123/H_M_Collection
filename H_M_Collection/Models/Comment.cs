using System;

namespace H_M_Collection.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsApproved { get; set; } = false;
        public int? PhotoId { get; set; }
        public Photo? Photo { get; set; }
    }
}


