/** new comment form relate */

const toggleStateEnum = Object.freeze({
    hidden: "hidden",
    expand: "expand",
});

const submitBtnMessage = Object.freeze({
    idle: "新增記錄",
    running: "送信中",
    retry: "請重試",
});

/** @type HTMLButtonElement | null */
const newCommentToggleBtn = document.querySelector("#new-comment-toggle");

if (newCommentToggleBtn) {
    newCommentToggleBtn.addEventListener("click", () => {
        updateToggleState();
    });
}

/** @type HTMLFormElement | null */
const newCommentForm = document.querySelector("#new-comment-form");

function updateToggleState() {
    if (!newCommentForm) return;

    if (newCommentForm.dataset["toggleState"] === toggleStateEnum.expand) {
        newCommentForm.dataset["toggleState"] = toggleStateEnum.hidden;
    } else {
        newCommentForm.dataset["toggleState"] = toggleStateEnum.expand;
    }
    console.log(newCommentForm.dataset["toggleState"]);
}

// TODO: submit record to database

newCommentForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    /** @type HTMLInputElement | null */
    const nameNode = newCommentForm.querySelector("input#new-comment-name");
    /** @type HTMLTextAreaElement | null */
    const contentNode = newCommentForm.querySelector(
        "textarea#new-comment-content",
    );
    /** @type HTMLButtonElement | null */
    const submitBtn = newCommentForm.querySelector("button");

    if (!nameNode) return;
    if (!contentNode) return;
    if (!submitBtn) return;

    submitBtn.innerHTML = submitBtnMessage.running;

    const name = nameNode.value;
    const content = contentNode.value;

    if (content === "") return;

    const result = await fetch("./post_comment", {
        method: "POST",
        body: JSON.stringify({ name: name, content }),
        headers: {
            "content-type": "application/json",
        },
    });

    if (result.status !== 200) {
        submitBtn.innerHTML = submitBtnMessage.retry;
    } else {
        submitBtn.innerHTML = submitBtnMessage.idle;
        nameNode.value = "";
        contentNode.value = "";
        updateToggleState();
        displayUserComment();
    }
});

// TODO: add fetch database logic

const displayCommentRoot = document.querySelector("#display-comment-root");
/**
 * @typedef {Object} commentType
 * @property {string} name
 * @property {string} content
 */

async function displayUserComment() {
    if (!displayCommentRoot) return;
    try {
        const resp = await fetch("./get_comment");

        /**@type commentType[] */
        const commentArray = await resp.json();
        // displayCommentRoot.innerHTML = JSON.stringify(commentArray);

        /**@type string[] */
        const stringBuffer = [];

        commentArray.forEach((v) => {
            stringBuffer.push(
                `<div class="comment-wrapper">
                    <div class="comment-name">${v.name}</div>
                    <div class="comment-content">${v.content}</div>
                </div>`,
            );
        });

        displayCommentRoot.innerHTML = stringBuffer.join("");
    } catch (e) {
        console.error(e);
    }
}

/** global */

document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        displayUserComment();
    }
});
