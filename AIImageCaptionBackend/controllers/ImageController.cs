using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

[ApiController]
[Route("api/[controller]")]
public class ImageController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public ImageController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile imageFile)
    {
        if (imageFile == null || imageFile.Length == 0)
        {
            return BadRequest("No image uploaded.");
        }

        // save picture to local  (or cloud)
        var filePath = Path.Combine("Uploads", Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName));
        Directory.CreateDirectory("Uploads");
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await imageFile.CopyToAsync(stream);
        }

        // use AI to generate caption 
        var caption = await GenerateCaptionWithGeminiAI(filePath);

        return Ok(new { Caption = caption, FilePath = filePath });
    }

    [HttpPost("review")]
    public IActionResult ReviewCaption([FromBody] CaptionReviewRequest reviewRequest)
    {
        if (reviewRequest == null || string.IsNullOrEmpty(reviewRequest.FilePath))
        {
            return BadRequest("Invalid review request.");
        }

        var metadata = new
        {
            reviewRequest.FilePath,
            ApprovedCaption = reviewRequest.ApprovedCaption,
            Status = reviewRequest.IsApproved ? "Approved" : "Rejected"
        };

        return Ok(metadata);
    }

    private async Task<string> GenerateCaptionWithGeminiAI(string filePath)
    {
        var client = _httpClientFactory.CreateClient();
        client.BaseAddress = new Uri("https://gemini-ai-api.com"); // 替换为 Gemini AI 的实际 API 地址

        using var formData = new MultipartFormDataContent();
        formData.Add(new StreamContent(new FileStream(filePath, FileMode.Open)), "file", Path.GetFileName(filePath));

        var response = await client.PostAsync("/generate-caption", formData);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Failed to generate caption with Gemini AI.");
        }

        var result = await response.Content.ReadAsStringAsync();
        return result; 
    }
}

public class CaptionReviewRequest
{
    public string FilePath { get; set; }
    public string ApprovedCaption { get; set; }
    public bool IsApproved { get; set; }
}
