using System.Diagnostics;
using H_M_Collection.Data;
using H_M_Collection.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Net.Http;

namespace H_M_Collection.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly H_M_CollectionDbContext _db;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;

        public HomeController(ILogger<HomeController> logger, H_M_CollectionDbContext db, IWebHostEnvironment env, IConfiguration config)
        {
            _logger = logger;
            _db = db;
            _env = env;
            _config = config;
        }

        public IActionResult Index()
        {
            ViewBag.RecaptchaSiteKey = _config.GetValue<string>("GoogleReCaptcha:SiteKey");

            var model = new HomeViewModel
            {
                // show only admin-shared (public) photos on the home page
                Photos = _db.Photos
                    .Where(p => p.IsPublic)
                    .OrderByDescending(p => p.UploadedAt)
                    .ToList(),
                // include comments that are approved OR comments that belong to a public photo
                ApprovedComments = _db.Comments
                    .Include(c => c.Photo)
                    .Where(c => c.IsApproved || (c.Photo != null && c.Photo.IsPublic))
                    .OrderByDescending(c => c.CreatedAt)
                    .ToList()
            };
            return View(model);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult SubmitComment(HomeViewModel form, int? photoId)
        {
            if (string.IsNullOrWhiteSpace(form.NewCommentCustomerName) || string.IsNullOrWhiteSpace(form.NewCommentContent))
            {
                ModelState.AddModelError(string.Empty, "Lütfen adınızı ve yorumunuzu giriniz.");
            }

            // Opsiyonel reCAPTCHA doğrulaması
            var recaptchaSecret = _config.GetValue<string>("GoogleReCaptcha:SecretKey");
            if (!string.IsNullOrWhiteSpace(recaptchaSecret))
            {
                try
                {
                    var token = Request.Form["RecaptchaToken"].ToString();
                    if (string.IsNullOrWhiteSpace(token))
                    {
                        ModelState.AddModelError(string.Empty, "Güvenlik doğrulaması başarısız oldu.");
                    }
                    else
                    {
                        using var client = new HttpClient();
                        var res = client.PostAsync($"https://www.google.com/recaptcha/api/siteverify?secret={recaptchaSecret}&response={token}", null).GetAwaiter().GetResult();
                        var payload = res.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                        if (!payload.Contains("\"success\": true"))
                        {
                            ModelState.AddModelError(string.Empty, "Güvenlik doğrulaması başarısız oldu.");
                        }
                    }
                }
                catch
                {
                    ModelState.AddModelError(string.Empty, "Güvenlik doğrulaması sırasında bir hata oluştu.");
                }
            }

            if (ModelState.IsValid)
            {
                int? createdPhotoId = null;
                if (form.NewCommentPhoto != null && form.NewCommentPhoto.Length > 0)
                {
                    // Tip ve boyut kontrolü (maks 5MB, sadece JPG/PNG/WEBP)
                    var allowedExts = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                    var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
                    var ext = Path.GetExtension(form.NewCommentPhoto.FileName).ToLowerInvariant();
                    var contentType = form.NewCommentPhoto.ContentType?.ToLowerInvariant() ?? string.Empty;
                    if (!allowedExts.Contains(ext) || !allowedTypes.Contains(contentType))
                    {
                        ModelState.AddModelError(string.Empty, "Sadece JPG, PNG veya WEBP dosyaları kabul edilir.");
                        goto ReloadInvalid;
                    }
                    if (form.NewCommentPhoto.Length > 5 * 1024 * 1024)
                    {
                        ModelState.AddModelError(string.Empty, "Dosya boyutu 5MB'ı geçmemelidir.");
                        goto ReloadInvalid;
                    }
                    var uploadsPath = Path.Combine(_env.WebRootPath, "uploads");
                    if (!Directory.Exists(uploadsPath))
                    {
                        Directory.CreateDirectory(uploadsPath);
                    }

                    var safeExt = Path.GetExtension(form.NewCommentPhoto.FileName);
                    var fileName = Path.GetFileNameWithoutExtension(Path.GetRandomFileName()) + safeExt;
                    var fullPath = Path.Combine(uploadsPath, fileName);
                    using (var stream = System.IO.File.Create(fullPath))
                    {
                        form.NewCommentPhoto.CopyTo(stream);
                    }

                    var photo = new Photo { FileName = fileName, IsPublic = false };
                    _db.Photos.Add(photo);
                    _db.SaveChanges();
                    createdPhotoId = photo.Id;
                }

                // Decide approval: if comment targets a public (admin) photo, publish immediately; otherwise require approval
                bool publishImmediately = false;
                if (photoId.HasValue)
                {
                    var targetPhoto = _db.Photos.FirstOrDefault(p => p.Id == photoId.Value);
                    if (targetPhoto != null && targetPhoto.IsPublic)
                    {
                        publishImmediately = true;
                    }
                }

                _db.Comments.Add(new Comment
                {
                    CustomerName = form.NewCommentCustomerName!.Trim(),
                    Content = form.NewCommentContent!.Trim(),
                    IsApproved = publishImmediately,
                    PhotoId = photoId ?? createdPhotoId
                });
                _db.SaveChanges();

                TempData["Message"] = publishImmediately ? "Yorumunuz yayınlandı." : "Yorumunuz alındı, onay sonrası yayınlanacaktır.";

                // Redirect back to relevant page
                if (photoId.HasValue || createdPhotoId.HasValue)
                {
                    return RedirectToAction("Index");
                }

                return RedirectToAction("Satisfaction");
            }

        ReloadInvalid:
            ViewBag.Photos = _db.Photos.OrderByDescending(p => p.UploadedAt).ToList();
            ViewBag.RecaptchaSiteKey = _config.GetValue<string>("GoogleReCaptcha:SiteKey");
            return View("Satisfaction");
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult Satisfaction()
        {
            // show only user-shared (private) photos on Satisfaction page
            ViewBag.Photos = _db.Photos
                .Where(p => !p.IsPublic)
                .OrderByDescending(p => p.UploadedAt)
                .ToList();
            ViewBag.RecaptchaSiteKey = _config.GetValue<string>("GoogleReCaptcha:SiteKey");
            return View();
        }

        public IActionResult Contact()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult UploadSatisfactionPhoto(IFormFile file, string? caption)
        {
            if (file == null || file.Length == 0)
            {
                TempData["Message"] = "Lütfen bir fotoğraf seçin.";
                return RedirectToAction("Satisfaction");
            }

            var uploadsPath = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            var fileName = Path.GetFileNameWithoutExtension(Path.GetRandomFileName()) + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(uploadsPath, fileName);
            using (var stream = System.IO.File.Create(fullPath))
            {
                file.CopyTo(stream);
            }

            // user uploads are private by default
            _db.Photos.Add(new Photo { FileName = fileName, Caption = caption, IsPublic = false });
            _db.SaveChanges();
            TempData["Message"] = "Fotoğraf yüklendi.";
            return RedirectToAction("Satisfaction");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
