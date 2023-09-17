using System.Text.RegularExpressions;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Google.Apis.Auth.GoogleJsonWebSignature;

namespace API.Controllers;

public class AttendanceController : BaseApiController
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;
    private readonly UserManager<AppUser> _userManager;
    private readonly TokenService _tokenService;
    private readonly IMapper _mapper;

    public AttendanceController(ApplicationDbContext context, IConfiguration config, UserManager<AppUser> userManager, TokenService tokenService, IMapper mapper)
    {
        _mapper = mapper;
        _tokenService = tokenService;
        _userManager = userManager;
        _context = context;
        _config = config;
    }

    //generate attendance link: the link will be sent to the students to mark their attendance
    // [Authorize]
    // [HttpPost("generateAttendanceLink")]
    // public async Task<ActionResult<SessionDto>> GenerateAttendanceLink(CreateSessionDto generateLinkDto)
    // {
    //     var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

    //     //create a new attendance link
    //     var attendanceLink = new Session
    //     {
    //         SessionName = generateLinkDto.SessionName,
    //         SessionExpiresAt = DateTime.UtcNow.AddMinutes(30),
    //         Host = user!,
    //     };

    //     //add the attendance link to the database
    //     _context.AttendantLinks.Add(attendanceLink);
    //     await _context.SaveChangesAsync();

    //     var token = await _tokenService.CreateAttendanceLinkToken(attendanceLink);

    //     //create a new attendance link dto
    //     var attendantLinkDto = new SessionDto
    //     {
    //         SessionId = attendanceLink.Id.ToString(),
    //         SessionName = attendanceLink.SessionName,
    //         SessionExpiresAt = attendanceLink.SessionExpiresAt,
    //         HostName = attendanceLink.Host.DisplayName,
    //         Token = token
    //     };

    //     return attendantLinkDto;
    // }

    // deleteAttendanceLink: delete the attendance link
    // [Authorize]
    // [HttpDelete("deleteAttendanceLink/{sessionId}")]
    // public async Task<ActionResult> DeleteAttendanceLink(string sessionId)
    // {
    //     var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

    //     var attendanceLink = await _context.AttendantLinks
    //         .FirstOrDefaultAsync(x => x.Id == Guid.Parse(sessionId));

    //     if (attendanceLink == null)
    //     {
    //         return BadRequest("Invalid session id");
    //     }

    //     if (attendanceLink.Host != user)
    //     {
    //         return Unauthorized("You are not authorized to delete this session");
    //     }

    //     _context.AttendantLinks.Remove(attendanceLink);
    //     await _context.SaveChangesAsync();

    //     return Ok();
    // }

    // //get the attendance links of the current user
    // // [Authorize]
    // [HttpGet("getAttendanceLinks")]
    // public async Task<ActionResult<List<SessionDto>>> GetAttendanceLinks()
    // {
    //     // var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

    //     // var attendanceLinks = await _context.AttendantLinks
    //     // .Where(x => x.Host == user)
    //     // .ToListAsync();

    //     return await _context.AttendantLinks
    //         .Include(x => x.Host)
    //         .ProjectTo<SessionDto>(_mapper.ConfigurationProvider)
    //         .ToListAsync();

    //     // var attendanceLinksDto = new List<AttendantLinkDto>();

    //     // foreach (var attendanceLink in attendanceLinks)
    //     // {

    //     //     var attendanceLinkDto = new AttendantLinkDto
    //     //     {
    //     //         SessionId = attendanceLink.Id.ToString(),
    //     //         SessionName = attendanceLink.SessionName,
    //     //         SessionExpiresAt = attendanceLink.SessionExpiresAt,
    //     //         HostName = attendanceLink.Host.DisplayName,
    //     //     };

    //     //     attendanceLinksDto.Add(attendanceLinkDto);
    //     // }

    //     // return attendanceLinksDto;
    // }

    //Create a new attendant for the attendance link
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

        var tokenValidated = await _tokenService.ValidateAttendanceLinkToken(linkToken);
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

        //check if the user already exists in the attendance link
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

    //get the attendants of the attendance link
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
