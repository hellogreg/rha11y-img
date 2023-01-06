javascript:(()=>{let e=!0;function t(t){e&&(t=void 0!==t?t:" \n------------------------------",console.log(t))}function n(t){e&&t&&console.dir(t)}function l(e){return e.nodeType===Node.DOCUMENT_FRAGMENT_NODE}function o(e,t){e.setAttribute("data-a11y","Accessible: "+!!t),e.style.setProperty("outline",(t?"#09fd":"#f90d")+" solid 8px","important"),e.style.setProperty("outline-offset","-4px","important"),e.style.setProperty("border-radius","2px","important"),e.style.setProperty("filter","initial","important")}function i(e){let n=!!e.hasAttribute("alt");if(t(" - Has alt attribute: "+n),n){let l=e.getAttribute("alt")||"[decorative]";t(" - Image alt value: "+l)}return!!n}function a(e){function n(e){let n=!1,o=l(e)?e.host.nodeName:e.nodeName;t("Checking if "+o+" is hidden");let i=!!e.hidden;if(n=n||i,t(" - Has hidden attribute: "+i),l(e)){t("Running shadow-specific hidden tests");let a=!!e.ariaHidden;n=n||a,t(" - aria-hidden: "+a);let r=!!e.getRootNode().host.ariaHidden;n=n||r,t(" - getRootNode().host.ariaHidden: "+r)}else{t("Running non-shadow hidden tests");let d="none"===getComputedStyle(e).display;n=n||d,t(" - display:none: "+d);let s=!!e.ariaHidden||"true"===e.getAttribute("aria-hidden");n=n||s,t(" - aria-hidden: "+s);let u="presentation"===e.getAttribute("role");n=n||u,t(" - role=presentation: "+u)}return!!n}let o=!1;for(;!o&&e&&"BODY"!==e.nodeName&&"HTML"!==e.nodeName&&e.nodeType!==Node.DOCUMENT_NODE&&e.nodeName;)if(o=o||n(e),e=e.parentNode?e.parentNode:l(e)?e.getRootNode().host.parentNode:null,!o&&e){let i=l(e)?e.host.nodeName:e.nodeName;t("Next parent: "+i)}return t("Either element or a parent is hidden: "+o),!!o}function r(e){let n=!1;t("Checking if <img> is accessible"),n=!!(i(e)||a(e)),t("Image is accessible: "+n),o(e,n)}function d(e){t("Checking if inline <svg> is accessible");let n=!1;n=(n=(n=(n=!!(function n(l){let o=l.querySelector("svg > title"),i=o&&o.textContent;if(t(" - Has <title>: "+!!i),i){let a=e.querySelector("svg > title").textContent||"[unspecified]";t(" - title: "+a)}return!!i}(e)&&function e(n){let l="img"===n.getAttribute("role");return t(" - Has role=img: "+!!l),!!l}(e)))||!!function e(n){let l=n.ariaLabel||n.getAttribute("aria-label"),o=!!l;return t(" - Has aria-label: "+o),o&&t(" - aria-label: "+l),!!o}(e))||!!function e(n){let l=n.ariaLabelledby||n.getAttribute("aria-labelledby"),o=!!l;t(" - Has aria-labelledby: "+o);let i,a=null;if(o){var r;let d;a=!!(i=(r=l,d=(d=d||n.getElementById(r)?n.getElementById(r).textContent:null)||document.getElementById(r)?document.getElementById(r).textContent:null)),t(" - aria-labelledby id: "+l),t(" - aria-labelledby value: "+i)}return!!o}(e))||a(e),t("svg is accessible: "+n),o(e,n)}function s(e){let n=e.querySelectorAll("svg");for(let l of n)t("Located an <svg>"),t(l.outerHTML),d(l),t();let o=e.querySelectorAll("img");for(let i of o)t("Located an <img>"),t(i.outerHTML),r(i),t();0===n.length&&0===o.length&&(t("No <img> or <svg> elements within"),t())}function u(e){l(e)&&(e=e.host),e.style&&(e.style.backgroundImage.match("url")||e.style.background.match("url")||e.style.backgroundImage.match("var"))&&(t("Background image found. They are not tested."),e.style.setProperty("background-color","#fffd"),e.style.setProperty("background-blend-mode","color"))}function c(){s(document);let e=document.querySelectorAll("*");for(let t of e)u(t)}function f(){function e(n,l){l=l+1||1;let o=n.querySelectorAll("*");for(let i of o){let a=i.shadowRoot;if(a){let r=a.host.nodeName||"[unspecified]",d=a.host.id||null;t("Found a nested shadowRoot (nesting level "+l+"): "+r),d&&t("id: "+d),s(a),u(a),e(a,l)}}}let n=document.querySelectorAll("*");for(let l of n){let o=l.shadowRoot;if(o){let i=o.host.nodeName||"[unspecified]",a=o.host.id||null;t("Found a shadowRoot: "+i),a&&t("id: "+a),s(o),u(o),e(o)}}}t("Initiating Rha11y-img bookmarklet"),t(),c(),f()})();