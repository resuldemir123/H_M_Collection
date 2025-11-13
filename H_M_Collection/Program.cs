using Microsoft.EntityFrameworkCore;
using H_M_Collection.Data; // DbContext'in bulunduğu namespace
using H_M_Collection.Models;
using Microsoft.AspNetCore.Identity;
using H_M_Collection.Services;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configure upload limits (e.g.,50 MB)
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit =50 *1024 *1024; //50 MB
});

// LocalDB bağlantısı
builder.Services.AddDbContext<H_M_CollectionDbContext>(options =>
 options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
 options.Password.RequireDigit = true;
 options.Password.RequiredLength =6;
 options.Password.RequireNonAlphanumeric = false;
 options.Password.RequireUppercase = false;
 options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<H_M_CollectionDbContext>()
.AddDefaultTokenProviders();

// Email sender
builder.Services.AddSingleton<IEmailSender, SmtpEmailSender>();

var app = builder.Build();

// Ensure database is created (dev/local)
using (var scope = app.Services.CreateScope())
{
 var services = scope.ServiceProvider;
 var db = services.GetRequiredService<H_M_Collection.Data.H_M_CollectionDbContext>();
 db.Database.EnsureCreated();

 // Seed default admin role and user
 var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
 var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
 const string adminRole = "Admin";
 const string adminEmail = "admin@hmcollection.com";
 const string adminUserName = "admin";
 const string adminPassword = "Admin123!"; // change this in production

 if (!roleManager.Roles.Any(r => r.Name == adminRole))
 {
 var role = new IdentityRole(adminRole);
 roleManager.CreateAsync(role).GetAwaiter().GetResult();
 }

 if (userManager.FindByEmailAsync(adminEmail).GetAwaiter().GetResult() == null)
 {
 var adminUser = new ApplicationUser { UserName = adminUserName, Email = adminEmail, EmailConfirmed = true };
 var res = userManager.CreateAsync(adminUser, adminPassword).GetAwaiter().GetResult();
 if (res.Succeeded)
 {
 userManager.AddToRoleAsync(adminUser, adminRole).GetAwaiter().GetResult();
 }
 }
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
 app.UseExceptionHandler("/Home/Error");
 app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
 name: "default",
 pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
