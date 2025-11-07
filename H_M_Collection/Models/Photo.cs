using System;

namespace H_M_Collection.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty; // stored under wwwroot/uploads
        public string? Caption { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public bool IsPublic { get; set; } = false;
    }
}


