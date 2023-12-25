/**
 * @typedef {Object} commentType
 * @property {string} name
 * @property {string} content
 */

function main() {
    /**
     * @type HTMLMetaElement | null
     */
    const searchResult = document.querySelector("meta[name='search-result']");
    if (searchResult === null) {
        console.error("meta[name='search-result'] not found");
        return;
    }

    const displayCommentRoot = document.querySelector("#display-comment-root");
    if (displayCommentRoot === null) {
        console.error("#display-comment-root not found");
        return;
    }

    /** @type commentType[] */
    const commentArray = JSON.parse(searchResult.content);

    /**@type string[] */
    const stringBuffer = [];

    commentArray.forEach((v) => {
        stringBuffer.push(
            `<div class="comment-wrapper card">
                <div class="card-body">
                    <div class="comment-name card-title">${v.name}</div>
                    <div class="comment-content card-text">${v.content}</div>
                </div>
            </div>`,
        );
    });

    displayCommentRoot.innerHTML = stringBuffer.join("");

    const query = new URL(window.location.href).searchParams.get("q");
    
    /** @type HTMLHeadingElement | null */
    const displayCommentMessage = document.querySelector("#display-comment-message");
    if (displayCommentMessage === null) {
        console.error("#display-comment-message not found");
        return;
    }

    if (query !== null) {
        displayCommentMessage.innerText = `Result of: "${query}"`;
    }

    /** @type HTMLInputElement | null */
    const searchInput = document.querySelector("#search-input");
    if (searchInput === null) {
        console.error("#search-inout not found");
        return;
    }

    if (query !== null) {
        searchInput.value = query;
    }

    /** @type HTMLButtonElement | null */
    const searchBtn = document.querySelector("#search-btn");
    searchBtn?.addEventListener("click", () => {
        const currentUrl = new URL(window.location.href);
        console.log(searchInput.value);
        if (searchInput.value === "") {
            currentUrl.searchParams.delete("q");
            window.location.assign(currentUrl.toString());
        } else {
            currentUrl.searchParams.set("q", searchInput.value);
            window.location.assign(currentUrl.toString());
        }
    });
}

document.addEventListener("DOMContentLoaded", () => main());
