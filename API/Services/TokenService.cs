using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;
public class TokenService
{
    private readonly IConfiguration _config;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<AppUser> _userManager;
    public TokenService(ApplicationDbContext context, UserManager<AppUser> userManager, IConfiguration config)
    {
        _context = context;
        _userManager = userManager;
        _config = config;
    }

    public async Task<string> CreateUserToken(AppUser user)
    {

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
        };

        var roles = await _userManager.GetRolesAsync(user);

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(1),
            SigningCredentials = creds
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    //create a token for the attendance link
    public async Task<string> CreateAttendanceLinkToken(AttendantLink attendantLink)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, attendantLink.SessionName),
            new Claim(ClaimTypes.NameIdentifier, attendantLink.Id.ToString()),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddMinutes(1),
            SigningCredentials = creds
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    //validate the attendance link token
    public async Task<bool> ValidateAttendanceLinkToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]));
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);


            if (validatedToken is not JwtSecurityToken jwtToken || !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }

        return true;
    }
}