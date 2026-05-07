<?php
header('Content-Type: application/json');

// Get the JSON input from script.js
$input = json_decode(file_get_contents('php://input'), true);
$userMessage = $input['message'] ?? '';

if (empty($userMessage)) {
    echo json_encode(['error' => 'No message provided']);
    exit;
}

// 1. Get your API Key from the system
$apiKey = getenv('GEMINI_API_KEY');                                                             
if (!$apiKey) 
{
    die(json_encode(["error" => ["message" => "Environment Variable GEMINI_API_KEY not found."]]));
}
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

// 3. Prepare the data payload
$data = [
    "contents" => [[
        "parts" => [["text" => $userMessage]]
    ]]
];

$ch = curl_init($url);

// --- THE FIX: Add these two lines to bypass SSL verification on Windows ---
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
// --------------------------------------------------------------------------

curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
} else {
    echo $response;
}

curl_close($ch);
?>