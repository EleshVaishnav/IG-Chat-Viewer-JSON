<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>IG Chat Viewer</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="dark">

<div class="topbar">
  <h2>IG JSON Chat Viewer</h2>
  <button id="themeBtn">Switch Theme</button>
</div>

<div class="panel">
  <input type="file" id="fileInput" accept=".json">
  <select id="meSelect">
    <option value="">Select YOUR name (right side)</option>
  </select>
</div>

<div id="chat"></div>

<script src="app.js"></script>
</body>
</html>
