using System.Security.Claims;
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

namespace API.Controllers;

public class SessionController : BaseApiController
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;
    private readonly UserManager<AppUser> _userManager;
    private readonly TokenService _tokenService;
    private readonly IMapper _mapper;

    public SessionController(ApplicationDbContext context, IConfiguration config, UserManager<AppUser> userManager, TokenService tokenService, IMapper mapper)
    {
        _mapper = mapper;
        _tokenService = tokenService;
        _userManager = userManager;
        _context = context;
        _config = config;
    }

    [Authorize]
    [HttpPost("createSession")]
    public async Task<ActionResult<SessionDto>> CreateSession(CreateSessionDto createSessionDto)
    {
        var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

        //create a new attendance link
        var attendanceLink = new Session
        {
            SessionName = createSessionDto.SessionName,
            SessionExpiresAt = DateTime.UtcNow.AddMinutes(30),
            Host = user!,
        };

        //add the attendance link to the database
        _context.AttendantLinks.Add(attendanceLink);
        await _context.SaveChangesAsync();

        var token = await _tokenService.CreateAttendanceLinkToken(attendanceLink);

        //create a new attendance link dto
        var attendantLinkDto = new SessionDto
        {
            SessionId = attendanceLink.Id.ToString(),
            SessionName = attendanceLink.SessionName,
            SessionExpiresAt = attendanceLink.SessionExpiresAt,
            LinkExpiresAt = DateTime.UtcNow.AddMinutes(createSessionDto.LinkExpiryFreequency ?? attendanceLink.SessionExpiresAt.Minute),
            HostName = attendanceLink.Host.DisplayName,
            Token = token
        };

        return attendantLinkDto;
    }

    [Authorize]
    [HttpDelete("deleteSession/{sessionId}")]
    public async Task<ActionResult> DeleteSession(string sessionId)
    {
        var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

        var attendanceLink = await _context.AttendantLinks
            .FirstOrDefaultAsync(x => x.Id == Guid.Parse(sessionId));

        if (attendanceLink == null)
        {
            return BadRequest("Invalid session id");
        }

        if (attendanceLink.Host != user)
        {
            return Unauthorized("You are not authorized to delete this session");
        }

        _context.AttendantLinks.Remove(attendanceLink);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [Authorize]
    [HttpGet("getSessions")]
    public async Task<ActionResult<List<SessionDto>>> GetSessions()
    {
        var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

        return await _context.AttendantLinks
            .Include(x => x.Host)
            .Where(x => x.Host == user)
            .ProjectTo<SessionDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }


}
