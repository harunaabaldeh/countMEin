using API.DTOs;
using API.Entities;
using API.Enums;
using AutoMapper;

namespace API.RequestHelpers;

public class MappingProfiles : Profile
{
    // _mapper.Map<SessionDto>(session, opt => opt.Items["LinkToken"] = token); accepts a third parameter of type Action<IMappingOperationOptions<TSource, TDestination>>? opts
    // https://docs.automapper.org/en/stable/Custom-value-resolvers.html#passing-parameters-to-custom-resolvers

    public MappingProfiles()
    {

        CreateMap<Session, SessionDto>()
        .ForMember(d => d.SessionId, o => o.MapFrom(s => s.Id.ToString()))
        .ForMember(d => d.HostName, o => o.MapFrom(s => s.Host.FirstName + " " + s.Host.LastName))
        .ForMember(d => d.AttendeesCount, o => o.MapFrom(s => s.Attendees.Count))
        .ForMember(d => d.Status, o => o.MapFrom(s => s.SessionExpiresAt > DateTime.UtcNow ? SessionStatus.Active.ToString() : SessionStatus.Expired.ToString()))
        .ForMember(d => d.SessionExpiresAt, o => o.MapFrom(s => s.SessionExpiresAt.ToLocalTime()))
        .ForMember(d => d.LinkToken, o => o.MapFrom((s, d, _, ctx) => ctx.Items.ContainsKey("LinkToken") ? ctx.Items["LinkToken"] : null)); // https://docs.automapper.org/en/stable/Custom-value-resolvers.html#passing-parameters-to-custom-resolvers
        // .ForMember(d => d.LinkToken, o => o.MapFrom((s, d, _, ctx) => ctx.Items["LinkToken"]));

        CreateMap<Session, SessionsDto>()
        .ForMember(d => d.SessionId, o => o.MapFrom(s => s.Id.ToString()))
        .ForMember(d => d.HostName, o => o.MapFrom(s => s.Host.FirstName + " " + s.Host.LastName))
        .ForMember(d => d.AttendeesCount, o => o.MapFrom(s => s.Attendees.Count))
        .ForMember(d => d.Status, o => o.MapFrom(s => s.SessionExpiresAt > DateTime.UtcNow ? SessionStatus.Active.ToString() : SessionStatus.Expired.ToString()))
        .ForMember(d => d.SessionExpiresAt, o => o.MapFrom(s => s.SessionExpiresAt.ToLocalTime()));

        CreateMap<Session, SessionAttendeesDto>()
        .ForMember(d => d.SessionId, o => o.MapFrom(s => s.Id.ToString()))
        .ForMember(d => d.HostName, o => o.MapFrom(s => s.Host.FirstName + " " + s.Host.LastName))
        .ForMember(d => d.AttendeesCount, o => o.MapFrom(s => s.Attendees.Count))
        .ForMember(d => d.Status, o => o.MapFrom(s => s.SessionExpiresAt > DateTime.UtcNow ? SessionStatus.Active.ToString() : SessionStatus.Expired.ToString()))
        .ForMember(d => d.SessionExpiresAt, o => o.MapFrom(s => s.SessionExpiresAt.ToLocalTime()));

        CreateMap<AppUser, UserDto>()
        .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.FirstName + " " + s.LastName))
        .ForMember(d => d.Token, o => o.MapFrom((s, d, _, ctx) => ctx.Items["AppUserToken"]));

    }
}
