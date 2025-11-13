using System.Threading.Tasks;

namespace H_M_Collection.Services
{
 public interface IEmailSender
 {
 Task SendEmailAsync(string to, string subject, string htmlBody);
 }
}
