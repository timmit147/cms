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

async function fetchOldData(commitHash) {
    try {
        const response = await fetch(
            `https://raw.githubusercontent.com/timmit147/cms/${commitHash}/database.js`
        );

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



async function placeBlock(changedData) {
    var data = await fetchAllData();
    if(changedData){
        data = changedData;
    }
    const blocksData = data["pages"]["page1"]["blocks"];

    // Get the container where the blocks will be placed
    const blockContainer = document.getElementById('blockContainer');

    for (const [index, block] of blocksData.entries()) {
        // Create a new div element for each block
        const blockDiv = document.createElement('div');

        // Loop over all items in the block object
        for (const key in block) {
            if (key === "type") {
                continue;
            }
            if (key === "hash") {
                continue;
            }
            if (block.hasOwnProperty(key)) {
                const inputLabel = document.createElement('label');
                inputLabel.textContent = key;
                inputLabel.style.fontWeight = 'bold';
                blockDiv.appendChild(inputLabel);

                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.value = block[key];
                blockDiv.appendChild(inputField);

                // Add event listener for 'keydown' event
                inputField.addEventListener('keydown', (event) => {
                    // Check if the Enter key is pressed (keyCode 13) or (key === "Enter" for modern browsers)
                    if (event.keyCode === 13 || event.key === "Enter") {
                        // Call a separate function to handle logging the text
                        sendRequestToPhp(`.pages.page1.blocks[${index}].${key}`, inputField.value);
                    }
                });
            }
        }

        // Create a reverse button for the block
        const reverseButton = document.createElement('button');
        reverseButton.textContent = 'Reverse';
        reverseButton.addEventListener('click', () => {
            // Call a separate function to handle the reverse action for this block
            reverseBlock(block.hash);
        });
        blockDiv.appendChild(reverseButton);

        // Add the div to the container
        blockContainer.appendChild(blockDiv);
    }
}

async function reverseBlock(hash) {
    console.log(hash);
    blockContainer.innerHTML = ''; // Clear the existing content

    try {
        const oldData = await fetchOldData(hash);
        placeBlock(oldData); // Call placeBlockWithData to process the fetched data
    } catch (error) {
        // Handle any errors that might occur during fetching or processing data
        console.error("Error:", error);
    }
}




function sendRequestToPhp(route, value) {
    const formData = new FormData();
    formData.append('JSON_PATH', route);
    formData.append('NEW_TITLE', value);

    fetch('server.php', {
        method: 'POST',
        body: formData
    })
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

  