using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("not-found")]
    public ActionResult GetNotFound()
    {
        return NotFound();
    }

    [HttpGet("bad-request")]
    public ActionResult GetBadRequest()
    {
        return BadRequest("This is a bad request");
    }

    [HttpGet("server-error")]
    public ActionResult GetServerError()
    {
        throw new Exception("This is a server error");
    }

    [HttpGet("unauthorised")]
    public ActionResult GetUnauthorised()
    {
        return Unauthorized();
    }

    [HttpPost("validation-error")]
    public ActionResult<string> GetValidationError()
    {
        ModelState.AddModelError("Test", "This is a test error");
        ModelState.AddModelError("Test2", "This is a test error 2");
        ModelState.AddModelError("Test3", "This is a test error 3");
        return ValidationProblem();
    }

}
