using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public static class ApplicationDbSeed
    {
        public static async Task SeedAsync(this ApplicationDbContext context, UserManager<AppUser> UserManager)
        {
            // Seed data here
            context.Database.EnsureCreated();

            if (!UserManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@gmail.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@gmail.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@gmail.com"
                    }
                };

                foreach (var user in users)
                {
                    await UserManager.CreateAsync(user, "Pa$$w0rd");

                    if (user.UserName == "bob")
                    {
                        await UserManager.AddToRolesAsync(user, new[] { "Admin", "Host" });
                    }
                    else
                    {
                        await UserManager.AddToRoleAsync(user, "Host");
                    }
                }

                await context.SaveChangesAsync();

            }

        }
    }
}