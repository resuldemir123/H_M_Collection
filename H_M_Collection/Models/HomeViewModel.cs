using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace H_M_Collection.Models
{
    public class HomeViewModel
    {
        public List<Photo> Photos { get; set; } = new();
        public List<Comment> ApprovedComments { get; set; } = new();

        public string? NewCommentCustomerName { get; set; }
        public string? NewCommentContent { get; set; }
        public IFormFile? NewCommentPhoto { get; set; }
        public string? Message { get; set; }
    }
}


