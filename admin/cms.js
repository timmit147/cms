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
  
      // Create input fields for title, content, link, and link_text
      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.value = block.title;
      blockDiv.appendChild(titleInput);
  
      const contentInput = document.createElement('textarea');
      contentInput.value = block.content;
      blockDiv.appendChild(contentInput);
  
      const linkInput = document.createElement('input');
      linkInput.type = 'text';
      linkInput.value = block.link;
      blockDiv.appendChild(linkInput);
  
      const linkTextInput = document.createElement('input');
      linkTextInput.type = 'text';
      linkTextInput.value = block.link_text;
      blockDiv.appendChild(linkTextInput);
  
      // Add the div to the container
      blockContainer.appendChild(blockDiv);
    }
  }
  
  
  
  
placeBlock();

  