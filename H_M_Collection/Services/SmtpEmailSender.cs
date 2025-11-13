using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace H_M_Collection.Services
{
 public class SmtpEmailSender : IEmailSender
 {
 private readonly IConfiguration _config;
 private readonly ILogger<SmtpEmailSender> _logger;

 public SmtpEmailSender(IConfiguration config, ILogger<SmtpEmailSender> logger)
 {
 _config = config;
 _logger = logger;
 }

 public async Task SendEmailAsync(string to, string subject, string htmlBody)
 {
 var host = _config["Smtp:Host"];
 var portString = _config["Smtp:Port"];
 var user = _config["Smtp:User"];
 var pass = _config["Smtp:Pass"];
 var from = _config["Smtp:From"] ?? user ?? "no-reply@hmcollection.com";

 if (string.IsNullOrWhiteSpace(host))
 throw new InvalidOperationException("SMTP host is not configured (Smtp:Host).");

 if (!int.TryParse(portString, out var port))
 {
 port =587; // default
 }

 // Optional flags (if not present defaults are used)
 var useSsl = false;
 var useStartTls = false;
 var useSslConfig = _config["Smtp:UseSsl"];
 var useStartTlsConfig = _config["Smtp:UseStartTls"];
 if (!string.IsNullOrWhiteSpace(useSslConfig) && bool.TryParse(useSslConfig, out var parsedSsl)) useSsl = parsedSsl;
 if (!string.IsNullOrWhiteSpace(useStartTlsConfig) && bool.TryParse(useStartTlsConfig, out var parsedTls)) useStartTls = parsedTls;

 // Ensure From matches authenticated user when possible to avoid provider rejections
 if (string.IsNullOrWhiteSpace(from) && !string.IsNullOrWhiteSpace(user))
 {
 from = user;
 }

 var email = new MimeMessage();
 try
 {
 email.From.Add(MailboxAddress.Parse(from));
 }
 catch (Exception ex)
 {
 _logger.LogWarning(ex, "Invalid SMTP From address: {From}", from);
 email.From.Add(MailboxAddress.Parse(user ?? "no-reply@hmcollection.com"));
 }

 email.To.Add(MailboxAddress.Parse(to));
 email.Subject = subject;
 var body = new BodyBuilder { HtmlBody = htmlBody };
 email.Body = body.ToMessageBody();

 using var client = new SmtpClient();
 try
 {
 SecureSocketOptions socketOptions = SecureSocketOptions.Auto;
 if (useSsl)
 {
 socketOptions = SecureSocketOptions.SslOnConnect;
 }
 else if (useStartTls)
 {
 socketOptions = SecureSocketOptions.StartTls;
 }
 else
 {
 socketOptions = SecureSocketOptions.Auto;
 }

 _logger.LogInformation("Connecting to SMTP server {Host}:{Port} (StartTls={StartTls}, Ssl={Ssl})", host, port, useStartTls, useSsl);
 await client.ConnectAsync(host, port, socketOptions);
 _logger.LogInformation("SMTP connected");

 if (!string.IsNullOrWhiteSpace(user) && !string.IsNullOrWhiteSpace(pass))
 {
 try
 {
 _logger.LogInformation("Authenticating SMTP user {User}", user);
 await client.AuthenticateAsync(user, pass);
 _logger.LogInformation("SMTP authentication successful");
 }
 catch (Exception ex)
 {
 _logger.LogError(ex, "SMTP authentication failed for user {User}", user);
 throw;
 }
 }
 else
 {
 _logger.LogWarning("SMTP credentials not provided; attempting to send without authentication");
 }

 _logger.LogInformation("Sending email to {To}", to);
 await client.SendAsync(email);
 _logger.LogInformation("Email sent to {To}", to);
 }
 catch (Exception ex)
 {
 _logger.LogError(ex, "SMTP send failed: {Message}", ex.Message);
 throw;
 }
 finally
 {
 if (client.IsConnected)
 {
 await client.DisconnectAsync(true);
 _logger.LogInformation("SMTP client disconnected");
 }
 }
 }
 }
}
