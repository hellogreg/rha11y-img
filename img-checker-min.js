javascript:(()=>{let e=!0;function t(t){e&&(t=void 0!==t?t:" \n------------------------------",console.log(t))}function n(t){e&&t&&console.dir(t)}function o(e,t){e.setAttribute("data-a11y","Accessible: "+!!t),e.style.setProperty("outline",(t?"#09fd":"#f90d")+" solid 8px","important"),e.style.setProperty("outline-offset","-4px","important"),e.style.setProperty("border-radius","2px","important"),e.style.setProperty("filter","initial","important")}function i(e){return e.nodeType===Node.DOCUMENT_FRAGMENT_NODE}function a(e){return!!e.shadowRoot}function l(e){return e=i(e)?e.getRootNode().host:e}function r(e){let n=!1;e=l(e);let o=e.nodeName;t("Checking if "+o+" is hidden");let i=!!e.hidden;n=n||i,t(" - hidden attribute: "+i);let a="none"===getComputedStyle(e).display;n=n||a,t(" - display:none: "+a);let r=!!e.ariaHidden||"true"===e.getAttribute("aria-hidden");n=n||r,t(" - aria-hidden: "+r);let d="presentation"===e.getAttribute("role");return n=n||d,t(" - role=presentation: "+d),!!n}function d(e){function n(e){return!!e&&"BODY"!==e.nodeName&&"HTML"!==e.nodeName&&e.nodeType!==Node.DOCUMENT_NODE&&e.nodeName}e=l(e);let o=!1;for(;!o&&n(e);)o=o||r(e),e=l(e=e.parentNode?e.parentNode:null),!o&&n(e)&&t("Next parent: "+e.nodeName);return t("Either element or a parent is hidden: "+!!o),!!o}function s(e){let n=!!e.hasAttribute("alt");if(t(" - Has alt attribute: "+n),n){let o=e.getAttribute("alt")||"[decorative]";t(" - Image alt value: "+o)}return!!n}function u(e){let n="title"===e.firstElementChild.tagName&&!!e.firstElementChild.textContent;return t(" - Has <title>: "+!!n),n&&t(" - title: "+e.firstElementChild.textContent),!!n}function c(e){let n="img"===e.getAttribute("role");return t(" - Has role=img (not required/sufficient on its own): "+!!n),!!n}function f(e){let n=e.ariaLabel||e.getAttribute("aria-label"),o=!!n;return t(" - Has aria-label: "+o),o&&t(" - aria-label: "+n),!!o}function g(e){let t=document.getElementById(e);return t?t.textContent:null}function b(e){let n=e.ariaLabelledby||e.getAttribute("aria-labelledby"),o=!!n;t(" - Has aria-labelledby: "+o);let i,a=null;return o&&(a=!!(i=g(n)),t(" - aria-labelledby id: "+n),t(" - aria-labelledby value: "+i)),!!o}function m(e){let n=!1;t("Checking if <img> is accessible"),n=(n=n||s(e))||d(e),t("<img> is accessible: "+n),o(e,n)}function y(e){t("Checking if inline <svg> is accessible");let n=!1;c(e),n=(n=(n=(n=n||!!u(e))||!!f(e))||!!b(e))||d(e),t("<svg> is accessible: "+n),o(e,n)}function h(e){(e=i(e)?e.getRootNode().host:e).style&&(e.style.backgroundImage.match("url")||e.style.background.match("url")||e.style.backgroundImage.match("var"))&&(t("Background image found. They are not tested."),e.style.setProperty("background-color","#fffd"),e.style.setProperty("background-blend-mode","color"))}let p=0;function N(e){let n=e.querySelectorAll("*");for(let o of n){if("img"===o.nodeName.toLowerCase()&&(t(),t("Located an <img>"),t(o.outerHTML),m(o)),"svg"===o.nodeName.toLowerCase()&&(t(),t("Located an <svg>"),t(o.outerHTML),y(o)),a(o)){let i=o.shadowRoot,l=i.getRootNode().host.nodeName||"[unspecified]";p+=1,t(),t("Checking "+l+" shadowRoot at nesting level "+p),N(i)}h(o)}let r=e.getRootNode().host?e.getRootNode().host.nodeName:null;p>0&&r&&(t(),t("Exiting "+r+" shadowRoot at nesting level "+p),p-=1),t()}!function e(){t(),t("Initiating Rha11y-img bookmarklet"),t();let n=document.body;N(n)}()})();