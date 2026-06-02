<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Agent Enquiry</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
    <h2>New Agent / Partner Enquiry Received</h2>
    <p>A new partner enquiry has been submitted with the following details:</p>
    <ul>
        <li><strong>Name:</strong> {{ $enquiry->name }}</li>
        <li><strong>Company:</strong> {{ $enquiry->company_name ?? '-' }}</li>
        <li><strong>Email:</strong> {{ $enquiry->email }}</li>
        <li><strong>Mobile:</strong> {{ $enquiry->mobile }}</li>
        <li><strong>Message:</strong> {{ $enquiry->message }}</li>
        <li><strong>Submitted At:</strong> {{ $enquiry->created_at?->format('Y-m-d H:i:s') }}</li>
    </ul>
</body>
</html>
