
        // Define a global variable to store the current page data
        let currentPage = null;

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
            if (!currentPage) {
                return;
            }

            const blocksData = currentPage["blocks"];
            const blockContainer = document.getElementById('blockContainer');
            blockContainer.innerHTML = ''; // Clear the existing content

            for (const [index, block] of blocksData.entries()) {
                const blockDiv = document.createElement('div');

                for (const key in block) {
                    if (key === "type" || key === "hash") {
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

                        inputField.addEventListener('keydown', (event) => {
                            if (event.keyCode === 13 || event.key === "Enter") {
                                sendRequestToPhp(`.pages.${currentPage.name}.blocks[${index}].${key}`, inputField.value);
                            }
                        });
                    }
                }

                const reverseButton = document.createElement('button');
                reverseButton.textContent = 'Reverse';
                reverseButton.addEventListener('click', () => {
                    reverseBlock(block.hash);
                });
                blockDiv.appendChild(reverseButton);

                blockContainer.appendChild(blockDiv);
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

        async function reverseBlock(hash) {
            console.log(hash);
            try {
                const oldData = await fetchOldData(hash);
                if (oldData && oldData.pages) {
                    const pages = oldData.pages;
                    for (const page in pages) {
                        if (pages.hasOwnProperty(page)) {
                            currentPage = pages[page];
                            currentPage.name = page;
                            placeBlock();
                            break; // Only process the first page found
                        }
                    }
                }
            } catch (error) {
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

        async function addMenuButtons() {
            const menuContainer = document.getElementById('menuContainer');

            try {
                var data = await fetchAllData();
                const pagesData = data["pages"];

                for (const page in pagesData) {
                    const button = document.createElement('button');
                    button.textContent = page;

                    button.addEventListener('click', () => {
                        currentPage = pagesData[page];
                        currentPage.name = page;
                        placeBlock();
                        console.log(`Button "${page}" clicked`);
                    });

                    menuContainer.appendChild(button);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        // Call the function to add the menu buttons
        addMenuButtons();

        // Call placeBlock without any argument to display the initial data (page1)
        placeBlock();