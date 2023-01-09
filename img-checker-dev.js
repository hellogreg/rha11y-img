javascript: (() => {
  let outputMessagesDefault = true;
  let outputMessages = outputMessagesDefault;

  function log(m) {
    if (outputMessages) {
      m = m !== undefined ? m : " \n------------------------------";
      console.log(m);
    }
  }

  function dir(m) {
    if (outputMessages && m) {
      console.dir(m);
    }
  }

  // Returns whether a tested element is a document-fragment
  function isShadowElement(element) {
    return element.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
  }

  // Display the test results: outline around image and data-a11y attribute in element
  function outputA11yResults(element, accessible) {
    // Add a data-a11y attribute to the element.
    // This attribute lists test results for someone inspecting the element.
    // TODO: Add more detail to the results.
    //
    element.setAttribute("data-a11y", "Accessible: " + !!accessible);

    // Outline the image with the pass/fail color.
    //
    const colorPass = "#09fd";
    const colorFail = "#f90d";
    const outlineColor = !!accessible ? colorPass : colorFail;
    element.style.setProperty("outline", outlineColor + " solid 8px", "important");
    element.style.setProperty("outline-offset", "-4px", "important");
    element.style.setProperty("border-radius", "2px", "important");

    // Remove any current filters on the element, because they affect outline color, too.
    element.style.setProperty("filter", "initial", "important");
  }

  // Test whether an <img> element has an alt attribute, even if it's null
  function hasAltAttribute(img) {
    const hasAlt = !!img.hasAttribute("alt");
    log(" - Has alt attribute: " + hasAlt);
    if (hasAlt) {
      const altValue = img.getAttribute("alt") || "[decorative]";
      log(" - Image alt value: " + altValue);
    }
    return !!hasAlt;
  }

  // Test all the ways elements can be hidden from assistive tech.
  function isElementOrParentHidden(element) {
    outputMessages = false;
    function isThisHidden(el) {
      let hidden = false;

      const elementName = isShadowElement(el) ? el.host.nodeName : el.nodeName;
      log("Checking if " + elementName + " is hidden");
      //dir(el);

      // Check for hidden attribute
      const hasHiddenAttr = !!el.hidden;
      hidden = hidden || hasHiddenAttr;
      log(" - Has hidden attribute: " + hasHiddenAttr);

      // Run tests specific to shadow and non-shadow elements
      if (isShadowElement(el)) {
        log("Running shadow-specific hidden tests");

        const isAriaHidden = !!el.ariaHidden;
        hidden = hidden || isAriaHidden;
        log(" - aria-hidden: " + isAriaHidden);

        const isHostAriaHidden = !!el.getRootNode().host.ariaHidden;
        hidden = hidden || isHostAriaHidden;
        log(" - getRootNode().host.ariaHidden: " + isHostAriaHidden);
      } else {
        log("Running non-shadow hidden tests");

        const hasDisplayNone = getComputedStyle(el).display === "none";
        hidden = hidden || hasDisplayNone;
        log(" - display:none: " + hasDisplayNone);

        const isAriaHidden = !!el.ariaHidden || el.getAttribute("aria-hidden") === "true";
        hidden = hidden || isAriaHidden;
        log(" - aria-hidden: " + isAriaHidden);

        const hasRolePresentation = el.getAttribute("role") === "presentation";
        hidden = hidden || hasRolePresentation;
        log(" - role=presentation: " + hasRolePresentation);
      }

      // TODO: Any other ways it could be hidden?

      return !!hidden;
    }

    let isHidden = false;

    // Check if element *or any parents* are hidden
    while (
      !isHidden &&
      !!element &&
      element.nodeName !== "BODY" &&
      element.nodeName !== "HTML" &&
      element.nodeType !== Node.DOCUMENT_NODE &&
      element.nodeName
    ) {
      // Check if the element is hidden
      isHidden = isHidden || isThisHidden(element);

      // Now get the element's parent element for the next iteration
      if (element.parentNode) {
        element = element.parentNode;
      } else if (isShadowElement(element)) {
        element = element.getRootNode().host.parentNode;
      } else {
        element = null;
      }

      if (!isHidden && element) {
        const parentName = isShadowElement(element) ? element.host.nodeName : element.nodeName;
        log("Next parent: " + parentName);
      }
    }

    outputMessages = outputMessagesDefault;

    log("Either element or a parent is hidden: " + isHidden);
    return !!isHidden;
  }

  // Test if an image is accessible (has alt or is hidden)
  function checkImgA11y(img) {
    let isAccessible = false;

    log("Checking if <img> is accessible");

    isAccessible = !!(hasAltAttribute(img) || isElementOrParentHidden(img));
    log("Image is accessible: " + isAccessible);
    outputA11yResults(img, isAccessible);
  }

  // Test if an svg is accessible (has an accessible name/role or is hidden)
  function checkSvgA11y(svg) {
    function hasTitle(s) {
      const title = s.querySelector("svg > title");
      const hasTitle = title && title.textContent;
      log(" - Has <title>: " + !!hasTitle);
      if (hasTitle) {
        const titleText = svg.querySelector("svg > title").textContent || "[unspecified]";
        log(" - title: " + titleText);
      }
      return !!hasTitle;
    }

    function hasImgRole(s) {
      const hasImgRole = s.getAttribute("role") === "img";
      log(" - Has role=img: " + !!hasImgRole);
      return !!hasImgRole;
    }

    function hasAriaLabel(s) {
      const ariaLabel = s.ariaLabel || s.getAttribute("aria-label");
      const hasAriaLabel = !!ariaLabel;
      log(" - Has aria-label: " + hasAriaLabel);
      if (hasAriaLabel) {
        log(" - aria-label: " + ariaLabel);
      }
      return !!hasAriaLabel;
    }

    function hasAriaLabelledby(s) {
      function getAriaLabelledbyValue(id) {
        let value;

        // See if the aria-labelledby element is within the SVG itself.
        value = value || s.getElementById(id) ? s.getElementById(id).textContent : null;

        // See if the aria-labelledby element is elsewhere in the page (excepting shadoRoots).
        value =
          value || document.getElementById(id) ? document.getElementById(id).textContent : null;

        // TODO: See if the aria-labelledby element is in a shadowRoot somewhere.

        return value;
      }

      const ariaLabelledbyId = s.ariaLabelledby || s.getAttribute("aria-labelledby");
      const hasAriaLabelledby = !!ariaLabelledbyId;
      log(" - Has aria-labelledby: " + hasAriaLabelledby);

      // Get the label value if the element has aria-labelledby attribute.
      let ariaLabelledbyValue;
      let hasAriaLabelledbyValue = null;
      if (hasAriaLabelledby) {
        ariaLabelledbyValue = getAriaLabelledbyValue(ariaLabelledbyId);
        hasAriaLabelledbyValue = !!ariaLabelledbyValue;
        log(" - aria-labelledby id: " + ariaLabelledbyId);
        log(" - aria-labelledby value: " + ariaLabelledbyValue);
      }

      // TODO: We're currently returning true if there's an aria-labelledby attribute at all.
      // But we should check to make sure it has a valid id and value.
      // Once hasAriaLabelledbyValue() can check shadowRoots, use the following:
      // return !!hasAriaLabelledbyValue;
      // But for now, we're using this:
      return !!hasAriaLabelledby;
    }

    log("Checking if inline <svg> is accessible");

    let isAccessible = false;

    isAccessible = !!(hasTitle(svg) && !!hasImgRole(svg));
    isAccessible = isAccessible || !!hasAriaLabel(svg);
    isAccessible = isAccessible || !!hasAriaLabelledby(svg);

    // TODO: Any other ways for an svg to be accessible?

    isAccessible = isAccessible || isElementOrParentHidden(svg);

    log("svg is accessible: " + isAccessible);
    outputA11yResults(svg, isAccessible);
  }

  // Fade out background images to indicate they are not tested
  function fadeBackgroundImages(node) {
    // Only fade images with a url/var value, not colors/gradients

    if (isShadowElement(node)) {
      node = node.host;
    }

    if (
      node.style &&
      (node.style.backgroundImage.match("url") ||
        node.style.background.match("url") ||
        node.style.backgroundImage.match("var"))
    ) {
      log("Background image found. They are not tested.");
      //node.style.setProperty("background-image", "none");
      node.style.setProperty("background-color", "#fffd");
      node.style.setProperty("background-blend-mode", "color");
    }
  }

  let rootLevel = 0;
  function findAndTestImages(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      if (node.nodeName.toLowerCase() === "svg") {
        log();
        log("Located an <svg>");
        log(node.outerHTML);
        checkSvgA11y(node);
      }

      if (node.nodeName.toLowerCase() === "img") {
        log();
        log("Located an <img>");
        log(node.outerHTML);
        checkImgA11y(node);
      }

      const shadowNode = node.shadowRoot;
      if (shadowNode) {
        const rootName = shadowNode.host.nodeName || "[unspecified]";
        rootLevel += 1;
        const rootId = shadowNode.host.id || null;
        log();
        log("Checking " + rootName + " shadowRoot at nesting level " + rootLevel);
        if (rootId) {
          log("id: " + rootId);
        }
        findAndTestImages(shadowNode);
      }

      fadeBackgroundImages(node);
    }

    if (rootLevel > 0 && root.host.nodeName) {
      log();
      log("Exiting " + root.host.nodeName + " shadowRoot at nesting level " + rootLevel);
      rootLevel -= 1;
    }
    log();
  }

  (function init() {
    log();
    log("Initiating Rha11y-img bookmarklet");
    log();

    // By default, we want to test all elements in the document body.
    // Change this parameter to narrow the scope.
    const root = document.body;
    findAndTestImages(root);
  })();
})();