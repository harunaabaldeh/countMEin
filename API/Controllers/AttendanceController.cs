using System.Text.RegularExpressions;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Google.Apis.Auth.GoogleJsonWebSignature;
using PdfSharp.Pdf;
using PdfSharp.Drawing;

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
        await _context.SaveChangesAsync();

        var attendeeDto = new AttendeeDto
        {
            FirstName = attendee.FirstName,
            LastName = attendee.LastName,
            Email = attendee.Email,
            MATNumber = attendee.MATNumber,
            SessionName = session.SessionName
        };

        return attendeeDto;
    }

    [Authorize]
    [HttpGet("sessionAttendees/{sessionId}")]
    public async Task<ActionResult<SessionAttendeesDto>> SessionAttendees(string sessionId)
    {
        return await _context.Sessions
            .Include(x => x.Attendees)
            .Include(x => x.Host)
            .OrderByDescending(x => x.CreatedAt)
            .Where(x => x.Id == Guid.Parse(sessionId))
            .ProjectTo<SessionAttendeesDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

    }

    [GeneratedRegex("\\d+")]
    private static partial Regex MyRegex();


    [HttpGet("ExportToPdf")]
    public async Task<IActionResult> ExportToPdf()
    {
        var attendees = await _context.Attendees.ToListAsync();
        var pdf = new PdfDocument();

        // font definitions
        var normalFont = new XFont("Arial", 12);
        var headerFont = new XFont("Arial", 18, XFontStyle.Bold);
        var columnheaderFont = new XFont("Arial", 14, XFontStyle.Bold);

        // page configuration
        int currentAttendeeIndex = 0;
        int attendeesPerPage = 2;
        int totalPages = (int)Math.Ceiling((double)attendees.Count / attendeesPerPage);

        for (int pageIdx = 0; pageIdx < totalPages; pageIdx++)
        {
            var page = pdf.AddPage();
            var gfx = XGraphics.FromPdfPage(page);
            int yPos = 50;

            // divide the page into four columns
            double columnWidth = (page.Width - 5) / 4;

            // Width for the "#" column
            double numberColumnWidth = 5; 

            // Header
            gfx.DrawString("Attendees", headerFont, XBrushes.Black, new XRect(0, yPos, page.Width, page.Height), XStringFormats.TopCenter);
            yPos += 50;

            // Column headers
            gfx.DrawString("#", columnheaderFont, XBrushes.Black, new XRect(5, yPos, numberColumnWidth, page.Height), XStringFormats.TopLeft);
            gfx.DrawString("First Name", columnheaderFont, XBrushes.Black, new XRect(30, yPos, columnWidth, page.Height), XStringFormats.TopLeft);
            gfx.DrawString("Last Name", columnheaderFont, XBrushes.Black, new XRect(170, yPos, columnWidth, page.Height), XStringFormats.TopLeft);
            gfx.DrawString("MAT Number", columnheaderFont, XBrushes.Black, new XRect(310, yPos, columnWidth, page.Height), XStringFormats.TopLeft);
            gfx.DrawString("Email", columnheaderFont, XBrushes.Black, new XRect(450, yPos, columnWidth, page.Height), XStringFormats.TopLeft);
            yPos += 20;

            // Attendees data
            for (int i = 0; i < attendeesPerPage && currentAttendeeIndex < attendees.Count; i++)
            {
                var attendee = attendees[currentAttendeeIndex];

                gfx.DrawString($"{currentAttendeeIndex + 1}", normalFont, XBrushes.Black, new XRect(5, yPos, numberColumnWidth, page.Height), XStringFormats.TopLeft);
                gfx.DrawString($"{attendee.FirstName}", normalFont, XBrushes.Black, new XRect(30, yPos, columnWidth, page.Height), XStringFormats.TopLeft);
                gfx.DrawString($"{attendee.LastName}", normalFont, XBrushes.Black, new XRect(170, yPos, columnWidth, page.Height), XStringFormats.TopLeft);
                gfx.DrawString($"{attendee.MATNumber}", normalFont, XBrushes.Black, new XRect(310, yPos, columnWidth, page.Height), XStringFormats.TopLeft);
                gfx.DrawString($"{attendee.Email}", normalFont, XBrushes.Black, new XRect(450, yPos, columnWidth, page.Height), XStringFormats.TopLeft);
                yPos += 25; // Add some space between attendees
                currentAttendeeIndex++;
            }
        }

        var pdfStream = new MemoryStream();
        pdf.Save(pdfStream, false);
        pdfStream.Seek(0, SeekOrigin.Begin);

        return File(pdfStream, "application/pdf", "Attendees.pdf");
    }
}

