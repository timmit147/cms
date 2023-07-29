<?php

function triggerGitHubAction($repositoryOwner, $repositoryName, $workflowName, $branch, $personalAccessToken) {
    // GitHub API endpoint to trigger workflow_dispatch event
    $url = "https://api.github.com/repos/{$repositoryOwner}/{$repositoryName}/actions/workflows/" . urlencode($workflowName) . "/dispatches";

    // Data to send in the POST request payload
    $data = ['ref' => $branch];

    // Convert data to JSON
    $jsonData = json_encode($data);

    // Set the HTTP headers
    $headers = [
        'Authorization: token ' . $personalAccessToken,
        'User-Agent: PHP',
        'Content-Type: application/json',
    ];

    // Set the request options
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $headers),
            'content' => $jsonData,
        ],
    ];

    // Create a context stream
    $context = stream_context_create($options);

    // Make the HTTP request and get the response
    $response = file_get_contents($url, false, $context);

    // Check for errors
    if ($response === false) {
        echo 'Error: ' . error_get_last()['message'];
    } else {
        echo 'GitHub Action triggered successfully!';
    }
}

// Sample usage:
$repositoryOwner = 'timmit147';
$repositoryName = 'cms';
$workflowName = 'add_new_block.yml';
$branch = 'main';  // Replace with the appropriate branch name
$personalAccessToken = "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";

triggerGitHubAction($repositoryOwner, $repositoryName, $workflowName, $branch, $personalAccessToken);
