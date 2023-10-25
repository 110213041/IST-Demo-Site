const message = `
This website contain vulnerably to XSS attack.
This is your last chance to leave!

Click "Cancel" to leave this website.`;

if (!confirm(message)) {
    window.location.href = "https://www.example.com";
}
