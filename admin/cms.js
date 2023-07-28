async function fetchAllData() {
    try {
        const response = await fetch("../database.js");
        if (!response.ok) {
        throw new Error("Network response was not ok.");
        }
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}


async function placeBlock() {
    const data = await fetchAllData();
    const blocksData = data["pages"]["page1"]["blocks"];

    // Get the container where the blocks will be placed
    const blockContainer = document.getElementById('blockContainer');

    for (const block of blocksData) {
        // Create a new div element for each block
        const blockDiv = document.createElement('div');

        // Loop over all items in the block object
        for (const key in block) {
            if (block.hasOwnProperty(key)) {
                // Create input field for each item in the block
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.value = block[key];
                blockDiv.appendChild(inputField);

                // Add event listener for 'keydown' event
                inputField.addEventListener('keydown', (event) => {
                    // Check if the Enter key is pressed (keyCode 13) or (key === "Enter" for modern browsers)
                    if (event.keyCode === 13 || event.key === "Enter") {
                        // Call a separate function to handle logging the text
                        logInputText(inputField.value);
                    }
                });
            }
        }

        // Add the div to the container
        blockContainer.appendChild(blockDiv);
    }
}

function logInputText(key) {
    console.log(key);
    sendRequestToPhp();   
}

function sendRequestToPhp() {
  // Replace 'your_php_file.php' with the correct path to your PHP file on the server
  fetch('server.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      console.log(data); // Output the response to the console
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}


  
  

  
  
  
  
placeBlock();

  