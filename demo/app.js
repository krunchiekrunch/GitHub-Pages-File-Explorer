document.addEventListener("DOMContentLoaded", () => {
    const repoOwner = "RadioactivePotato";
    const repoName = "GitHub-Page-File-Explorer";
    const baseUrl = `https://${repoOwner}.github.io/${repoName}`;
    const fileTree = document.getElementById("file-tree");
    const token = 'PERSONAL_ACCESS_TOKEN'; // Check README

    async function fetchRepoContents(path = "") {
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`;
        const response = await fetch(url, {
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch repository contents: ${response.statusText}`);
        }
        return response.json();
    }

    async function displayRepoContents(path = "", parentElement = fileTree) {
        const contents = await fetchRepoContents(path);
        parentElement.innerHTML = ""; // Clear existing content

        const folders = [];
        const files = [];

        // Categorize contents into folders and files
        contents.forEach(content => {
            if (content.type === "dir") {
                folders.push(content);
            } else if (content.type === "file") {
                files.push(content);
            }
        });

        // Display folders first
        folders.forEach(folder => {
            const folderItem = createTreeItem(folder.name, true);
            parentElement.appendChild(folderItem);

            const childTree = document.createElement("ul");
            childTree.classList.add("file-tree", "collapsed");
            folderItem.appendChild(childTree);

            folderItem.addEventListener("click", (event) => {
                event.stopPropagation(); // Stop event propagation
                if (folderItem.classList.contains("expanded")) {
                    folderItem.classList.remove("expanded");
                    childTree.classList.add("collapsed");
                } else {
                    folderItem.classList.add("expanded");
                    childTree.classList.remove("collapsed");
                }
            });

            displayRepoContents(folder.path, childTree);
        });

        // Display files
        files.forEach(file => {
            const fileItem = createTreeItem(file.name, false);
            fileItem.addEventListener("click", (event) => {
                event.stopPropagation(); // Stop event propagation
                const fileUrl = `${baseUrl}/${file.path}`;
                window.open(fileUrl, "_blank");
            });
            parentElement.appendChild(fileItem);
        });
    }

    function createTreeItem(name, isFolder) {
        const itemElement = document.createElement("li");
        const nameElement = document.createElement("div");
        nameElement.textContent = name;
        itemElement.appendChild(nameElement);
        itemElement.classList.add("file-tree-item");
        if (isFolder) {
            const iconElement = document.createElement("span");
            iconElement.classList.add("icon");
            iconElement.textContent = "▶"; // Always display as "▶"
            nameElement.insertBefore(iconElement, nameElement.firstChild);
        }
        return itemElement;
    }

    displayRepoContents();

});
