javascript: (() => {
  // alt decision tree: https://www.w3.org/WAI/tutorials/images/decision-tree/
  // Access lit components with renderRoot? https://lit.dev/docs/components/shadow-dom/
  //
  // How to account for shadowroots that are hidden, or whose parents are hidden?
  // It's easy to run isElementHidden on them and then skip any checking, but
  // then the images within won't be marked as passing a11y checks.
  // Unless we make a function/parameter to just find and mark them as passing.

  const outputMessagesDefault = true;
  let outputMessages = outputMessagesDefault;

  function log(m) {
    if (outputMessages) {
      m = m !== undefined ? m : "-----------------";
      console.log(m);
    }
  }

  function dir(m) {
    if (outputMessages && m) {
      console.dir(m);
    }
  }

  function highlightElement(element, color) {
    color = color || "#eee";
    element.style.setProperty("outline", color + " solid 8px", "important");
  }

  function hasAltAttribute(img) {
    hasAlt = img.hasAttribute("alt");
    log("Has alt attribute: " + hasAlt);
    if (hasAlt) {
      const altValue = img.getAttribute("alt") || "[decorative]";
      log("Image alt value: " + altValue);
    }
    return hasAlt;
  }

  // Test all ways elements can be hidden from assistive tech...
  function isElementHidden(element) {
    log("Checking if hidden...");

    function isHidden(el) {
      let hid;
      log("Testing if " + el.nodeName + " is hidden.");

      // Check for hidden attribute
      hid = hid || el.hidden;

      // Check for aria-hidden="true" and role="presentation"
      // Uses Firefox getAttribute() workaround for ariaHidden
      try {
        hid = hid || el.ariaHidden || el.getAttribute("aria-hidden") === "true";
      } catch (e) {
        hid = hid || el.ariaHidden;
        log(
          "Can't test " + el.nodeName + " for aria-hidden attribute. (Probably a web component.)"
        );
      }

      // Check for role="presentation"
      try {
        hid = hid || el.getAttribute("role") === "presentation";
      } catch (e) {
        log("Can't test " + el.nodeName + " for role attribute. (Probably a web component.)");
      }

      // Checks inline and external styles for display: none
      try {
        hid = hid || getComputedStyle(el).display === "none";
      } catch (e) {
        log("Can't test " + el.nodeName + " for computed style. (Probably a web component.)");
      }

      // TODO: Any other ways it could be hidden?

      return !!hid;
    }

    function areAnyParentsHidden(el) {
      let hid;
      let parent = el.parentNode;
      // To test for web component parent: parent.nodeType !== 11 {
      while (!hid && parent && parent.nodeName !== "BODY" && parent.nodeName) {
        hid = hid || isHidden(parent);
        parent = parent.parentNode;
      }

      return hid;
    }

    let hidden = isHidden(element);
    log("Image hidden from AT: " + !!hidden);

    if (!hidden) {
      hidden = hidden || areAnyParentsHidden(element);
    }

    log("Element or parent is hidden: " + hidden);
    return !!hidden;
  }

  function checkImgA11y(img) {
    log("Checking if image is accessible");
    log(img.src);

    let isAccessible = !!(hasAltAttribute(img) || isElementHidden(img));

    log("Element is accessible: " + isAccessible);
    if (isAccessible) {
      highlightElement(img, "#09f");
    } else {
      highlightElement(img, "#f90");
    }

    log();
  }

  function checkSvgA11y(svg) {
    let title = svg.querySelector("svg > title");
    let hasTitle = title && title.textContent;
    let hasRoleImg = svg.getAttribute("role") === "img";
    let isAccessible = hasTitle && hasRoleImg;

    return !!isAccessible;
  }

  function checkNonShadowImages() {
    // Get all non-shadow imgs
    const imgs = document.querySelectorAll("img");
    for (const img of imgs) {
      checkImgA11y(img);
    }

    // Get all non-shadow svgs
    const svgs = document.querySelectorAll("svg");
    for (const svg of svgs) {
      log("Inline SVG Accessible: " + checkSvgA11y(svg));
      highlightElement(svg, "#ff0");
      log();
    }
  }

  function findNestedShadowRoots(sr, i) {
    i = i + 1 || 1;
    const nodes = sr.querySelectorAll("*");
    for (const node of nodes) {
      const shadowChild = node.shadowRoot;
      if (shadowChild) {
        log(
          "Found a shadow child (nesting level " +
            i +
            "): " +
            shadowChild.lastElementChild.localName
        );

        const imgs = shadowChild.querySelectorAll("img");
        for (const img of imgs) {
          log("Found img in level " + i + " shadowRoot");
          checkImgA11y(img);
        }

        log();

        // Keep checking for more nesting levels.
        findNestedShadowRoots(shadowChild, i);
      }
    }
  }

  // Get every img and svg that's in a shadowRoot.
  function checkShadowImages() {
    const nodes = document.querySelectorAll("*");
    for (const node of nodes) {
      const shadowNode = node.shadowRoot;
      if (shadowNode) {
        log("Found a top-level shadowRoot: " + shadowNode.lastElementChild.localName);
        findNestedShadowRoots(shadowNode);

        const imgs = shadowNode.querySelectorAll("img");
        for (const img of imgs) {
          log("Found img in top-level shadowRoot");
          checkImgA11y(img);
        }

        const svgs = node.shadowRoot.querySelectorAll("svg");
        for (const svg of svgs) {
          checkSvgA11y(svg);
          highlightElement(svg, "#06f");
          log();
        }
      }
    }
  }

  (function init() {
    setTimeout(() => {
      log("Initiating image test bookmarklet.");
      log();
      checkNonShadowImages();
      checkShadowImages();
    }, 0); // Can set delay in testing
  })();
})();
