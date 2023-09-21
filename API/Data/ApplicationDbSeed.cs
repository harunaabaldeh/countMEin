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
                        FirstName = "Bob",
                        LastName = "Bobbity",
                        UserName = "bob@gmail.com",
                        Email = "bob@gmail.com"
                    },
                    new AppUser
                    {
                        FirstName = "Tom",
                        LastName = "Tommy",
                        UserName = "tom@gmail.com",
                        Email = "tom@gmail.com"
                    },
                    new AppUser
                    {
                        FirstName = "Jane",
                        LastName = "Janey",
                        UserName = "jane@gmail.com",
                        Email = "jane@gmail.com"
                    }
                };

                foreach (var user in users)
                {
                    await UserManager.CreateAsync(user, "Pa$$w0rd");

                    if (user.UserName == "bob@gmail.com")
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

            if (!context.Sessions.Any())
            {
                var sessions = new List<Session>
                {
                    new Session
                    {
                        HostId = UserManager.Users.FirstOrDefault(u => u.UserName == "bob@gmail.com").Id,
                        SessionName = "Session 1",
                        SessionExpiresAt = DateTime.UtcNow.AddDays(1),
                        Attendees = new List<Attendee>
                        {
                            new Attendee
                            {
                               Id = 1,
                                 FirstName = "Bob",
                                    LastName = "Bobbity",
                                    Email = "bob@exampl.com",
                                    MATNumber = "123456",
                                    CreatedAt = DateTime.UtcNow
                            },
                            new Attendee
                            {
                                Id = 2,
                                FirstName = "Tom",
                                LastName = "Tommy",
                                Email = "tom@example.com",
                                MATNumber = "123456",
                                CreatedAt = DateTime.UtcNow
                            },
                            new Attendee
                            {
                                Id = 3,
                                FirstName = "Jane",
                                LastName = "Janey",
                                Email = "jane@example.com",
                                MATNumber = "123456",
                                CreatedAt = DateTime.UtcNow,
                            }
                        }
                    },
                    new Session
                    {
                        HostId = UserManager.Users.FirstOrDefault(u => u.UserName == "bob@gmail.com").Id,
                        SessionName = "Session 2",
                        SessionExpiresAt = DateTime.UtcNow.AddDays(1),
                        Attendees = new List<Attendee>
                        {
                            new Attendee
                            {
                                Id = 4,
                                FirstName = "Bob",
                                LastName = "Bobbity",
                                Email = "bob@example.com",
                                MATNumber = "123456",
                                CreatedAt = DateTime.UtcNow
                            },
                            new Attendee
                            {
                                Id = 5,
                                FirstName = "Tom",
                                LastName = "Tommy",
                                Email = "tom@tommy.tom",
                                MATNumber = "123456",
                                CreatedAt = DateTime.UtcNow
                            },
                        }
                    },
                };

                await context.Sessions.AddRangeAsync(sessions);
                await context.SaveChangesAsync();
            }

        }
    }
}