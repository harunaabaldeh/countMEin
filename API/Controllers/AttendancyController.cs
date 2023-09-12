using System.Security.Claims;
using System.Text.RegularExpressions;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Google.Apis.Auth.GoogleJsonWebSignature;

namespace API.Controllers;

public class AttendancyController : BaseApiController
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;
    private readonly UserManager<AppUser> _userManager;
    private readonly TokenService _tokenService;

    public AttendancyController(ApplicationDbContext context, IConfiguration config, UserManager<AppUser> userManager, TokenService tokenService)
    {
        _tokenService = tokenService;
        _userManager = userManager;
        _context = context;
        _config = config;
    }

    //generate attendancy link: the link will be sent to the students to mark their attendancy
    [Authorize]
    [HttpPost("generateAttendancyLink")]
    public async Task<ActionResult<AttendantLinkDto>> GenerateAttendancyLink(GenerateLinkDto generateLinkDto)
    {
        var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

        //create a new attendancy link
        var attendancyLink = new AttendantLink
        {
            SessionName = generateLinkDto.SessionName,
            SessionExpiresAt = DateTime.UtcNow.AddMinutes(30),
            Host = user!,
        };

        //add the attendancy link to the database
        _context.AttendantLinks.Add(attendancyLink);
        await _context.SaveChangesAsync();

        var token = await _tokenService.CreateAttendancyLinkToken(attendancyLink);

        //create a new attendancy link dto
        var attendantLinkDto = new AttendantLinkDto
        {
            SessionId = attendancyLink.Id.ToString(),
            SessionName = attendancyLink.SessionName,
            SessionExpiresAt = attendancyLink.SessionExpiresAt,
            HostName = attendancyLink.Host.DisplayName,
            Token = token
        };

        return attendantLinkDto;
    }

    //get the attendancy links of the current user
    [Authorize]
    [HttpGet("getAttendancyLinks")]
    public async Task<ActionResult<List<AttendantLinkDto>>> GetAttendancyLinks()
    {
        var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

        var attendancyLinks = await _context.AttendantLinks
            .Where(x => x.Host == user)
            .ToListAsync();

        var attendancyLinksDto = new List<AttendantLinkDto>();

        foreach (var attendancyLink in attendancyLinks)
        {

            var attendancyLinkDto = new AttendantLinkDto
            {
                SessionId = attendancyLink.Id.ToString(),
                SessionName = attendancyLink.SessionName,
                SessionExpiresAt = attendancyLink.SessionExpiresAt,
                HostName = attendancyLink.Host.DisplayName,
            };

            attendancyLinksDto.Add(attendancyLinkDto);
        }

        return attendancyLinksDto;
    }

    //Create a new attendant for the attendancy link
    [Authorize]
    [HttpPost("createAttendant/{sessionId}")]
    public async Task<ActionResult<AttendantDto>> CreateAttendant(string sessionId, string accessToken, string linkToken)
    {
        var attendantLink = await _context.AttendantLinks
            .Include(x => x.Attendants)
            .FirstOrDefaultAsync(x => x.Id == Guid.Parse(sessionId));

        if (attendantLink == null)
        {
            return BadRequest("Invalid session id");
        }

        if (attendantLink.SessionExpiresAt < DateTime.UtcNow)
        {
            return BadRequest("Session expired");
        }

        var tokenValidated = await _tokenService.ValidateAttendancyLinkToken(linkToken);
        if (!tokenValidated) return BadRequest("Invalid token");


        //google access token validation
        var validationSettings = new ValidationSettings
        {
            Audience = new[] {
                _config["Google:ClientId"]
            }
        };

        var payload = await ValidateAsync(accessToken, validationSettings);

        if (payload == null)
        {
            return BadRequest("Invalid access token");
        }

        //check if the user already exists in the attendancy link
        var attendant = await _context.Attendants
            .FirstOrDefaultAsync(x => x.Email == payload.Email && x.AttendantLink == attendantLink);

        if (attendant != null)
        {
            return BadRequest("You already joined this session");
        }

        //create a new attendant
        attendant = new Attendant
        {
            Email = payload.Email,
            FirstName = payload.GivenName,
            LastName = payload.FamilyName,
            AttendantLink = attendantLink,
            MATNumber = Regex.Match(payload.Email, @"\d+").Value ?? "000000"
        };

        //add the attendant to the database
        _context.Attendants.Add(attendant);
        await _context.SaveChangesAsync();

        //create a new attendant dto
        var attendantDto = new AttendantDto
        {
            FirstName = attendant.FirstName,
            LastName = attendant.LastName,
            Email = attendant.Email,
            MATNumber = attendant.MATNumber,
            SessionName = attendantLink.SessionName
        };

        return attendantDto;
    }

    //get the attendants of the attendancy link
    [Authorize]
    [HttpGet("getAttendants/{sessionId}")]
    public async Task<ActionResult<List<AttendantDto>>> GetAttendants(string sessionId)
    {
        var attendantLink = await _context.AttendantLinks
            .Include(x => x.Attendants)
            .FirstOrDefaultAsync(x => x.Id == Guid.Parse(sessionId));

        if (attendantLink == null)
        {
            return BadRequest("Invalid session id");
        }

        var attendants = attendantLink.Attendants;

        var attendantsDto = new List<AttendantDto>();

        foreach (var attendant in attendants)
        {
            var attendantDto = new AttendantDto
            {
                FirstName = attendant.FirstName,
                LastName = attendant.LastName,
                Email = attendant.Email,
                MATNumber = attendant.MATNumber,
                SessionName = attendantLink.SessionName
            };

            attendantsDto.Add(attendantDto);
        }

        return attendantsDto;
    }

}
