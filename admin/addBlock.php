<?php

$repositoryOwner = 'timmit147';
$repositoryName = 'cms';
$personalAccessToken = "";

// The block name to be sent to the workflow
$blockName = 'block1';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.github.com/repos/$repositoryOwner/$repositoryName/dispatches");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['event_type' => 'add_block', 'client_payload' => ['blockName' => $blockName]]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: token $personalAccessToken",
    "Content-Type: application/json",
    "User-Agent: Awesome-Octocat-App"
]);

$result = curl_exec($ch);
curl_close($ch);

echo $result;
?>
