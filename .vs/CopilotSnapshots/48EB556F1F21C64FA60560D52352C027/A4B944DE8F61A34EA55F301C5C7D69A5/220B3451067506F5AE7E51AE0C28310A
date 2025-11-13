using H_M_Collection.Models;
using Microsoft.EntityFrameworkCore;

namespace H_M_Collection.Data
{
    public class H_M_CollectionDbContext : DbContext
    {
        public H_M_CollectionDbContext(DbContextOptions<H_M_CollectionDbContext> options) : base(options)
        {
        }

        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<Photo> Photos => Set<Photo>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.Property(p => p.CustomerName).HasMaxLength(100).IsRequired();
                entity.Property(p => p.Content).HasMaxLength(2000).IsRequired();
                entity.Property(p => p.IsApproved).HasDefaultValue(false);
                entity.Property(p => p.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.HasOne(p => p.Photo)
                      .WithMany()
                      .HasForeignKey(p => p.PhotoId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Photo>(entity =>
            {
                entity.Property(p => p.FileName).HasMaxLength(255).IsRequired();
                entity.Property(p => p.Caption).HasMaxLength(500);
                entity.Property(p => p.UploadedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(p => p.IsPublic).HasDefaultValue(false);
            });
        }
    }
}
