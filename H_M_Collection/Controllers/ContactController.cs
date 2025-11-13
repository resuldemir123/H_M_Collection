using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using H_M_Collection.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace H_M_Collection.Controllers
{
 public class ContactController : Controller
 {
 private readonly IEmailSender _emailSender;
 private readonly IConfiguration _config;
 private readonly ILogger<ContactController> _logger;

 public ContactController(IEmailSender emailSender, IConfiguration config, ILogger<ContactController> logger)
 {
 _emailSender = emailSender;
 _config = config;
 _logger = logger;
 }

 [HttpPost]
 [ValidateAntiForgeryToken]
 public async Task<IActionResult> Send(string name, string email, string subject, string message)
 {
 if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(message))
 {
 TempData["Message"] = "Lütfen adýnýzý, e-posta adresinizi ve mesajýnýzý giriniz.";
 return RedirectToAction("Contact", "Home");
 }

 var adminEmail = _config["Admin:Email"] ?? _config["Smtp:From"] ?? "admin@hmcollection.com";
 var body = $"Yeni iletiþim formu gönderildi:\n\nGönderen: {name} <{email}>\nKonu: {subject}\n\nMesaj:\n{message}";
 try
 {
 await _emailSender.SendEmailAsync(adminEmail, "Ýletiþim Formu: " + (string.IsNullOrWhiteSpace(subject) ? "Yeni Mesaj" : subject), body);
 TempData["Message"] = "Mesajýnýz gönderildi. En kýsa sürede dönüþ yapýlacaktýr.";
 }
 catch (System.Exception ex)
 {
 _logger.LogError(ex, "Ýletiþim formu e-posta gönderimi baþarýsýz oldu");
 TempData["Message"] = "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyiniz.";
 }

 return RedirectToAction("Contact", "Home");
 }
 }
}
