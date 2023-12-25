/**
 * 
 * @param {HTMLElement} parent iframe sandbox mount location.
 * @param {string} content HTML string.
 */
export function createSecureSandbox(parent, content) {
    /**
     * @type {HTMLIFrameElement | null} iframeDom;
     */
    let iframeDom;
    iframeDom = document.querySelector("iframe[id=mount-sandbox]");
    if (iframeDom === null) {
        iframeDom = document.createElement("iframe");

        iframeDom.id = "mount-sandbox";

        // basic
        iframeDom.style.height = "100vh";
        iframeDom.style.width = "100vw";

        iframeDom.sandbox.add("allow-same-origin");

        parent.append(iframeDom);

        iframeDom.onload = update
    } else {
        update();
    }

    function update() {
        if (iframeDom === null) {
            return;
        }

        const iframeDocument = iframeDom.contentDocument;
        if (iframeDocument === null) {
            return;
        }

        /**
         * @param {string} href
         */
        const cssLinkTemplate = (href) => {
            const cssLink = iframeDocument.createElement("link");
            cssLink.href = href;
            cssLink.rel = "stylesheet";
            cssLink.type = "text/css";
            return cssLink;
        }

        iframeDocument.head.appendChild(cssLinkTemplate("/static/css/bootstrap.min.css"));
        iframeDocument.head.appendChild(cssLinkTemplate("/static/css/common.css"));
        iframeDocument.head.appendChild(cssLinkTemplate("/static/css/index.css"));

        iframeDocument.body.innerHTML = content;
    }
}