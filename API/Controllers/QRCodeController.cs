using QRCoder;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace API.Controllers;

public class QRCodeController : BaseApiController
{
    [HttpGet]
    public IActionResult GetQRCode()
    {
        // Create QRCodeGenerator instance
        QRCodeGenerator qrGenerator = new();

        //client id and redirect uri are dummy values
        var clientId = "559758667407-k0a5jbbmsabs5v5e6carbuj4md1tluao.apps.googleusercontent.com";
        // var redirectUri = Request.Scheme + "://" + Request.Host + "/api/qrcode/googleAuth";
        var redirectUri = "https://localhost:7231/api/qrcode/googleAuth";
        var auth_url = $"https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id={clientId}&scope=openid%20email%20profile&redirect_uri={redirectUri}&state=STATE&nonce=NONCE";

        //payload so when scanned, it prompt user to login with their google account
        var payload = new
        {
            //"https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=CLIENT_ID&scope=openid%20email%20profile&redirect_uri=REDIRECT_URI&state=STATE&nonce=NONCE"
            auth_url,
            email = "fabaldibbasey27@gmail.com",
            email_verified = true,
            name = "John Doe",
        };

        // Create QRCodeData instance
        QRCodeData qrCodeData = qrGenerator.CreateQrCode(JsonConvert.SerializeObject(payload), QRCodeGenerator.ECCLevel.Q);

        // Return QRCode as image
        var qrCode = new PngByteQRCode(qrCodeData);

        return File(qrCode.GetGraphic(10), "image/png");
    }

    [HttpGet("googleAuth")]
    public async Task<ActionResult<string>> GoogleAuth(string code)
    {
        try
        {
            var client_id = "559758667407-k0a5jbbmsabs5v5e6carbuj4md1tluao.apps.googleusercontent.com";
            var client_secret = "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";
            var redirectUri = "https://localhost:7231/api/qrcode/googleAuth";
            var token_url = "https://oauth2.googleapis.com/token";


            var client = new HttpClient();
            var tokenResponse = await client.PostAsync(token_url, new FormUrlEncodedContent(new Dictionary<string, string>
            {
                {"code", code},
                {"client_id", client_id},
                {"client_secret", client_secret},
                {"redirect_uri", redirectUri},
                {"grant_type", "authorization_code"}
            }));

            var responseString = await tokenResponse.Content.ReadAsStringAsync();
            var tokenData = JsonConvert.DeserializeObject<Dictionary<string, string>>(responseString);

            var accessToken = tokenData["access_token"];

            var userInfoResponse = await client.GetAsync($"https://www.googleapis.com/oauth2/v1/userinfo?access_token={accessToken}");
            var userInfoResponseString = await userInfoResponse.Content.ReadAsStringAsync();
            var userInfoData = JsonConvert.DeserializeObject<Dictionary<string, string>>(userInfoResponseString);

            return Ok(userInfoData);

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw;
        }

    }
}
