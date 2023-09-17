using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Session, SessionDto>()
        .ForMember(d => d.SessionId, o => o.MapFrom(s => s.Id.ToString()))
        .ForMember(d => d.HostName, o => o.MapFrom(s => s.Host.DisplayName));

    }
}
