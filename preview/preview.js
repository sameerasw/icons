//tokens
const GITHUB_TOKEN = "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";
let user = "sameerasw";
let repo = "mac-icons";
let folderIcons = "";
let appIcons = "";

// fetch the folder content list of filenames withr rest api
async function fetchFolderContentList(folder) {
    const response = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${folder}`, {
        headers: {
            "Authorization": `token ${GITHUB_TOKEN}`
        }
    });
    const data = await response.json();
    return data;
}

// fetch the file content with rest api
async function fetchFileContent(file) {
    const response = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${file}`, {
        headers: {
            "Authorization": `token ${GITHUB_TOKEN}`
        }
    });
    const data = await response.json();
    return data;
}

// fetch the folder icons list
async function fetchFolderIconsList() {
    const folderIconsList = await fetchFolderContentList("folder-icons");
    return folderIconsList;
}

// fetch the app icons list
async function fetchAppIconsList() {
    const appIconsList = await fetchFolderContentList("app-icons");
    return appIconsList;
}

// fetch the folder icons
async function fetchFolderIcons() {
    const folderIconsList = await fetchFolderIconsList();
    const folderIcons = await Promise.all(folderIconsList.map(async (icon) => {
        const file = await fetchFileContent(icon.path);
        return file;
    }));
    return folderIcons;
}

// fetch the app icons
async function fetchAppIcons() {
    const appIconsList = await fetchAppIconsList();
    const appIcons = await Promise.all(appIconsList.map(async (icon) => {
        const file = await fetchFileContent(icon.path);
        return file;
    }));
    return appIcons;
}

// sort the icons list
function sortIconsList(iconsList) {
    iconsList.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
}

// create the icons
function createIcons(iconsList) {
    let icongrid = document.getElementById("grid");
    iconsList.forEach((icon) => {
        if (icon) {
            let img = document.createElement("img");
            img.src = `data:image/png;base64,${icon.content}`;
            img.alt = icon.name;
            img.title = icon.name;
            img.classList.add("icon");
            icongrid.appendChild(img);
        }
    });
}

// filter the icons based on the search input
function filterIcons() {
    let search = document.getElementById("search");
    let icongrid = document.getElementById("grid");
    search.addEventListener("input", function (e) {
        let value = e.target.value.toLowerCase();
        let icons = icongrid.querySelectorAll("img");
        icons.forEach((icon) => {
            if (icon.src.toLowerCase().includes(value) || icon.alt.toLowerCase().includes(value)) {
                icon.style.display = "block";
                setTimeout(() => {
                    icon.style.scale = "1";
                }, 100);
            } else {
                icon.style.scale = "0";
                icon.style.display = "none";
            }
        });
    });
}

// open the image in a new tab when clicked
function openImageInNewTab() {
    let icongrid = document.getElementById("grid");
    icongrid.addEventListener("click", function (e) {
        if (e.target.tagName === "IMG") {
            window.open(e.target.src, "_blank");
        }
    });
}

// main function
async function main() {
    folderIcons = await fetchFolderIcons();
    appIcons = await fetchAppIcons();
    sortIconsList(folderIcons);
    sortIconsList(appIcons);
    createIcons(folderIcons, "folder-icons");
    createIcons(appIcons, "app-icons");
    filterIcons();
    openImageInNewTab();
}
