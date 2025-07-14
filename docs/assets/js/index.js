document.addEventListener('DOMContentLoaded', () => {
  loadDescription();
  loadRepos();
});

async function loadDescription() {
  // Markdown to HTML conversion
  const converter = new showdown.Converter({ tables: true });
  const readme = await fetch('https://raw.githubusercontent.com/Dev2Forge/docs/refs/heads/main/README.md');
  const readmeText = await readme.text();
  const html_readme = converter.makeHtml(readmeText);

  const description = document.querySelector('#description');
  description.innerHTML = html_readme || '';
  __format_HTML(description);
}

/**
 * Load repositories from GitHub API and display them in a grid.
 * Each repository is displayed in a card format with its name, description, and a link to the repo.
 */
async function loadRepos() {
  const container = document.querySelector('#carrusel-repos');
  const configsWeb = await loadConfigs();
  try {
    const res = await fetch('https://api.github.com/orgs/dev2forge/repos');
    /**
     * @type {Array<String>}
     */
    let repos = await res.json();
    repos = repos.sort((a, b) => a?.name?.toLowerCase().charCodeAt(0) - b?.name?.toLowerCase().charCodeAt(0));
    repos.forEach((repo) => {
      // Skip repositories that are not in the configsWeb list
      if (!configsWeb.ignoreRepos.includes(repo.name)) {
        const card = document.createElement('div');
        card.className = 'flex flex-col justify-between items-center w-64 h-95 bg-gray-100 dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition snap-start row-span-1';
        card.innerHTML = `
                <h2 class="text-xl font-semibold text-center w-full mb-2">${repo.name}</h2>
                <div class="flex-1 w-full overflow-y-auto mb-2 no-scrollbar">
                    <p class="text-sm text-gray-600 dark:text-gray-300 text-center break-words">${repo.description || 'No description'}</p>
                </div>
                <div class="w-full flex justify-center mt-auto gap-3">
                    <a href="${repo.html_url}" target="_blank" class="btn-repo-link flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 shadow hover:scale-110 hover:bg-blue-500 hover:text-white transition border border-blue-300 dark:border-blue-700 mr-0.5">
                        <img width="24" height="24" src="https://cdn.jsdelivr.net/gh/tutosrive/images-projects-srm-trg@refs/heads/main/svg-icons-flags-cursor/icon/github-logo.svg" alt="GitHub">
                    </a>
                    <a href="${repo.homepage}" class="btn-repo-link flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 shadow hover:scale-110 hover:bg-blue-500 hover:text-white transition border border-blue-300 dark:border-blue-700 ml-0.5">
                        <img width="16" height="16" src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/box-arrow-up-right.svg" alt="Icon redirect">
                    </a>
                </div>
                <div class="w-full flex justify-center pt-4">
                  <img alt="Pepy Total Downloads" src="https://img.shields.io/pepy/dt/${fix_name(repo.name)}?color=blue&style=flat-square" class="h-5 object-contain me-1">
                  <img alt="PyPI - Version" src="https://img.shields.io/pypi/v/${fix_name(repo.name)}?color=orange" class="h-5 object-contain">
                </div>
                <div class="w-full flex justify-center">
                  <img width="100" src="${configsWeb.logos[repo.name.toLowerCase()]}" alt="${repo.name} logo" class="object-cover rounded mt-2">
                </div>
                <div class="w-full flex justify-center mt-2">
                    <code class="text-sm">pip install ${fix_name(repo.name)}</code>
                </div>
            `;

        container.appendChild(card);
      }
    });
  } catch (e) {
    console.log(e);
    container.innerHTML = '<p class="text-red-500">Failed to load repositories.</p>';
  }
}

function fix_name(name) {
  return name === 'E-SRM' ? 'effect-srm' : name;
}

async function loadConfigs() {
  const req = await fetch('./assets/json/configs.json');
  const data = await req.json();
  return data;
}

function __format_HTML(ctn) {
  const h1 = document.querySelector('#title-head');
  const title_reame = ctn.querySelector('#dev2forgehttpswwwdev2forgesoftwaredocumentationportal');
  h1.innerHTML = title_reame.innerHTML;
  title_reame.remove();
}
