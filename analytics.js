/* Portfolio analytics: Microsoft Clarity and meaningful GA4 interactions. */
(function () {
  "use strict";

  var clarityProjectId = "y0j9bebkad";

  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
    t = l.createElement(r);
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", clarityProjectId);

  function sendEvent(name, parameters) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, parameters || {});
  }

  function cleanText(value) {
    return (value || "").replace(/\\s+/g, " ").trim().slice(0, 100);
  }

  function projectName(pathname) {
    var decoded = decodeURIComponent(pathname).toLowerCase();
    if (decoded.indexOf("/projects/website") !== -1) return "beauty_clinic_website";
    if (decoded.indexOf("/projects/ai") !== -1) return "ai_image_direction";
    if (decoded.indexOf("/projects/photo gallery") !== -1) return "photography_videography";
    if (decoded === "/projects" || decoded === "/projects/") return "projects_overview";
    return "other_project";
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link) return;

    var rawHref = link.getAttribute("href") || "";
    var label = cleanText(link.getAttribute("aria-label") || link.textContent);
    var common = {
      link_url: link.href,
      link_text: label,
      source_page: window.location.pathname
    };

    if (rawHref.indexOf("mailto:") === 0) {
      sendEvent("contact_email_click", common);
      return;
    }

    if (/linkedin\\.com/i.test(link.href)) {
      sendEvent("linkedin_click", common);
      return;
    }

    if (/instagram\\.com/i.test(link.href)) {
      sendEvent("instagram_click", common);
      return;
    }

    if (/\\.pdf(?:$|[?#])/i.test(link.href)) {
      sendEvent("resume_download", common);
      return;
    }

    try {
      var target = new URL(link.href, window.location.href);
      if (target.origin === window.location.origin && target.pathname.toLowerCase().indexOf("/projects") === 0) {
        common.project_name = projectName(target.pathname);
        sendEvent("case_study_open", common);
      }
    } catch (error) {
      // Ignore malformed or browser-specific link protocols.
    }
  });

  [30, 60, 120].forEach(function (seconds) {
    window.setTimeout(function () {
      if (document.visibilityState === "visible") {
        sendEvent("engaged_time_milestone", {
          seconds: seconds,
          page_path: window.location.pathname
        });
      }
    }, seconds * 1000);
  });
})();
