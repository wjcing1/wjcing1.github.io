(function () {
  const USERNAME = "wjcing1";
  const ENDPOINT = `https://api.github.com/users/${USERNAME}/repos?per_page=100&type=owner&sort=updated`;

  const langColors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Go: "#00ADD8",
    Rust: "#dea584",
  };

  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}.${m}`;
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function renderRow(repo) {
    const lang = repo.language || "—";
    const dotColor = langColors[lang] || "var(--soft)";
    const desc = repo.description || "No description.";
    const stars = repo.stargazers_count ?? 0;

    return `
      <a class="grid-row" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer">
        <div class="cell-name-wrap">
          <span class="project-name">${escapeHtml(repo.name)}</span>
          <span class="project-desc">${escapeHtml(desc)}</span>
        </div>
        <div class="cell-lang-wrap">
          <span class="lang-pill">
            <span class="lang-dot" style="background:${dotColor}"></span>
            ${escapeHtml(lang)}
          </span>
        </div>
        <div class="cell-stars-wrap">
          <span class="cell-num">★ ${stars}</span>
        </div>
        <div class="cell-updated-wrap">
          <span class="cell-meta">${formatDate(repo.updated_at)}</span>
        </div>
        <div class="cell-link-wrap">
          <span class="cell-link">
            View
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17 17 7"></path>
              <path d="M8 7h9v9"></path>
            </svg>
          </span>
        </div>
      </a>
    `;
  }

  async function load() {
    const body = document.getElementById("projectsBody");
    if (!body) return;

    try {
      const res = await fetch(ENDPOINT, {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const repos = await res.json();
      const visible = repos
        .filter((r) => !r.fork && !r.private && !r.archived)
        .filter((r) => r.name !== "-")
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      if (visible.length === 0) {
        body.innerHTML = `<div class="grid-loading">No public repositories yet.</div>`;
        const counter = document.getElementById("projectsCount");
        if (counter) counter.textContent = "0 repos";
        return;
      }

      body.innerHTML = visible.map(renderRow).join("");

      const counter = document.getElementById("projectsCount");
      if (counter) counter.textContent = `${visible.length} repos`;
    } catch (err) {
      console.error(err);
      body.innerHTML = `<div class="grid-error">Failed to load from GitHub (${escapeHtml(err.message)}). Check your connection or rate limits.</div>`;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
