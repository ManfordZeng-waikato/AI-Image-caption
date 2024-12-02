using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class MetadataController : ControllerBase
{
    [HttpGet]
    public IActionResult GetMetadata()
    {
        return Ok(new { Id = 1, Caption = "Sample Caption", Location = "New York" });
    }
}
