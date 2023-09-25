using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Google.Apis.Auth.GoogleJsonWebSignature;

namespace API.Controllers;

public partial class AttendanceController : BaseApiController
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

    [AllowAnonymous]
    [HttpPost("createAttendee/{sessionId}")]
    public async Task<ActionResult<AttendeeDto>> CreateAttendee(string sessionId, string accessToken, string linkToken)
    {
        var session = await _context.Sessions
            .Include(x => x.Attendees)
            .FirstOrDefaultAsync(x => x.Id == Guid.Parse(sessionId));

        if (session == null)
        {
            return BadRequest("Invalid session id");
        }

        if (session.SessionExpiresAt < DateTime.UtcNow)
        {
            return BadRequest("Session expired");
        }

        var tokenValidated = _tokenService.ValidateAttendanceLinkToken(linkToken);
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
        var attendee = await _context.Attendees
            .FirstOrDefaultAsync(x => x.Email == payload.Email && x.Session == session);

        if (attendee != null)
        {
            return BadRequest("You already joined this session");
        }

        //create a new attendee
        attendee = new Attendee
        {
            Email = payload.Email,
            FirstName = payload.GivenName,
            LastName = payload.FamilyName,
            Session = session,
            MATNumber = MyRegex().Match(payload.Email).Value ?? "000000"
            // MATNumber = Regex.Match(payload.Email, @"\d+").Value ?? "000000"

        };

        _context.Attendees.Add(attendee);
        var saved = await _context.SaveChangesAsync();

        if (saved < 1)
            return BadRequest("Failed to create attendee");

        return _mapper.Map<AttendeeDto>(attendee);
    }

    [Authorize]
    [HttpGet("sessionAttendees/{sessionId}")]
    public async Task<ActionResult<SessionAttendeesDto>> SessionAttendees(string sessionId, [FromQuery] SessionAttendeeParams sessionAttendeeParams)
    {
        var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

        var session = await _context.Sessions
            .Include(x => x.Host)
            .Where(x => x.Host == user && x.Id == Guid.Parse(sessionId))
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (session == null) return BadRequest("Invalid session id");

        var query = _context.Attendees
            .Where(x => x.Session == session)
            .SortSessionAttendees(sessionAttendeeParams.OrderBy ?? "attendeeCreatedAtDesc")
            .SearchSessionAttendees(sessionAttendeeParams.SearchTerm)
            .AsNoTracking()
            .AsQueryable();

        var attendees = await PageList<Attendee>.CreateAsync(query, sessionAttendeeParams.PageNumber, sessionAttendeeParams.PageSize);

        Response.AddPaginationHeader(attendees.MetaData);

        session.Attendees = attendees;

        return _mapper.Map<SessionAttendeesDto>(session);
    }



    [GeneratedRegex("\\d+")]
    private static partial Regex MyRegex();

    [Authorize]
    [HttpGet("ExportToCsv/{sessionId}")]
    public async Task<ActionResult> SaveToCSV(string sessionId)
    {
        var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

        var session = await _context.Sessions
            .Include(x => x.Attendees)
            .Include(x => x.Host)
            .Where(x => x.Id == Guid.Parse(sessionId) && x.Host == user)
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (session == null) return BadRequest("Invalid session id");

        var csvData = new StringBuilder();

        csvData.AppendLine("FirstName,LastName,MATNumber,Email");

        foreach (var attendee in session.Attendees)
        {
            csvData.AppendLine($"{attendee.FirstName},{attendee.LastName},{attendee.MATNumber},{attendee.Email}");
        }

        var csvBtes = Encoding.UTF8.GetBytes(csvData.ToString());

        return File(csvBtes, "text/csv", "Attendees.csv");
    }
}
