<?php
// Log the entire POST data to check if it includes JSON_PATH and NEW_TITLE
error_log(print_r($_POST, true));

$repoOwner = 'timmit147';
$repoName = 'cms'; // Update to the correct repository name without .git
$workflowFileName = 'update_json.yml';
$token = '';

// Define the JSON_PATH and NEW_TITLE values
$jsonPath = isset($_POST['JSON_PATH']) ? $_POST['JSON_PATH'] : null;
$newTitle = isset($_POST['NEW_TITLE']) ? $_POST['NEW_TITLE'] : null;


if ($jsonPath === null || $newTitle === null) {
  echo "JSON_PATH or NEW_TITLE is missing in the POST data.",$_POST['JSON_PATH'];
  exit();
}

// Create a new GitHub API request to trigger the repository dispatch event
$url = "https://api.github.com/repos/{$repoOwner}/{$repoName}/dispatches";
$headers = [
  "Authorization: token {$token}",
  "User-Agent: PHP"
];
$data = [
  'event_type' => 'php_request', // Match the event type defined in the workflow
  'client_payload' => [
    'JSON_PATH' => $jsonPath,
    'NEW_TITLE' => $newTitle
  ]
];

// Use cURL to make the POST request
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Check for errors and handle the response
if ($httpCode === 204) {
  echo "Workflow triggered successfully!";
} else {
  echo "Failed to trigger workflow. HTTP Code: {$httpCode}\n";
  echo "Response: {$response}\n";
}

curl_close($ch);
?>
