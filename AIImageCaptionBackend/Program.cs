var builder = WebApplication.CreateBuilder(args);

// Add services to the container
// Configure Swagger with custom API information
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "AI Image Caption API",
        Version = "v1",
        Description = "API for managing and generating image captions.",
       
        
    });
});

var app = builder.Build();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React 前端地址
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddHttpClient();




// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AI Image Caption API v1");
        c.RoutePrefix = string.Empty; // Makes Swagger available at the root URL
    });
}

app.UseHttpsRedirection();

// Replace the default route with a custom API route
app.MapGet("/api/captions", () =>
{
    var captions = new[]
    {
        new { Id = 1, Caption = "A beautiful sunset over the mountains" },
        new { Id = 2, Caption = "A bustling city street during rush hour" },
        new { Id = 3, Caption = "A calm beach with crystal-clear water" }
    };
    return captions;
})
.WithName("GetImageCaptions")
.WithOpenApi(); // Adds this route to Swagger


app.Run();
