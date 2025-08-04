// Run the setup function when the DOM content is fully loaded (best practice over window.onload)
let allEpisodes = []; 

document.addEventListener("DOMContentLoaded", setup);

/**
 * Initializes the page by fetching all episodes and displaying them.
 */
function setup() {
   allEpisodes = getAllEpisodes(); // Provided from episodes.js
  
  makePageForEpisodes(allEpisodes);     // Render all episodes on page
  setupEpisodeSelect(); // selector dropdown for episodes
  setupSearchFunction(); // search functionality
  
}

/**
 * Renders a list of TV show episodes on the web page.
 * @param {Array} episodeList - An array of episode objects.
 */
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ''; // Clear any previous content


  // Create a container to hold all episode cards
  const episodeContainer = document.createElement('div');
  episodeContainer.id = 'episode-container';
  rootElem.appendChild(episodeContainer);

  // Iterate over each episode and create a card
  episodeList.forEach((episode) => {
    const episodeCard = document.createElement('div');
    episodeCard.className = 'episode-card';

    // Format title as "S02E07 - Episode Name"
    const episodeTitle = document.createElement('h3');
    episodeTitle.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;

    // Display episode image or fallback
    const episodeImage = document.createElement('img');
    episodeImage.src = episode.image?.medium || 'placeholder.jpg'; // Optional chaining + fallback
    episodeImage.alt = episode.name;

    // Display episode summary (may contain HTML)
    const episodeSummary = document.createElement('p');
    episodeSummary.innerHTML = episode.summary || 'No summary available.';

    // Link to original episode page on TVMaze
    const episodeLink = document.createElement('a');
    episodeLink.href = episode.url;
    episodeLink.target = '_blank';
    episodeLink.rel = 'noopener noreferrer';
    episodeLink.textContent = 'View on TVMaze';

    // Append all episode elements to card
    episodeCard.appendChild(episodeTitle);
    episodeCard.appendChild(episodeImage);
    episodeCard.appendChild(episodeSummary);
    episodeCard.appendChild(episodeLink);

    // Append card to the container
    episodeContainer.appendChild(episodeCard);
  });
}

/**
 * Formats the episode code using zero-padded season and episode numbers.
 * @param {number} season - The season number
 * @param {number} number - The episode number
 * @returns {string} A formatted code like "S02E07"
 */
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, '0')}E${String(number).padStart(2, '0')}`;
}

function setupSearchFunction() {
  const searchInput = document.getElementById("searchInput");
  const episodeCount = document.getElementById("episodeCount");

  // Set initial count
  updateEpisodeCount(allEpisodes.length);

  // Add event listener for search input
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter(episode => {
      const name = episode.name.toLowerCase();
      const summary = episode.summary.toLowerCase();
      return name.includes(searchTerm) || summary.includes(searchTerm);
    });

    updateEpisodeCount(filteredEpisodes.length);
    makePageForEpisodes(filteredEpisodes);
  });
}

function updateEpisodeCount(matchCount) {
  const episodeCount = document.getElementById("episodeCount");
  episodeCount.textContent = `Displaying ${matchCount}/${allEpisodes.length} episodes`;
}

function setupEpisodeSelect() {
  const episodeSelect = document.getElementById("episodeSelect");
  
  // Populate select with episodes
  allEpisodes.forEach(episode => {
    const option = document.createElement("option");
    const episodeCode = formatEpisodeCode(episode.season, episode.number);
    option.value = `${episode.season}-${episode.number}`;
    option.textContent = `${episodeCode} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });

  // Handle episode selection
  episodeSelect.addEventListener("change", (e) => {
    if (e.target.value === "") {
      makePageForEpisodes(allEpisodes);
      updateEpisodeCount(allEpisodes.length);
      return;
    }

    const [season, number] = e.target.value.split("-").map(Number);
    const selectedEpisode = allEpisodes.find(
      episode => episode.season === season && episode.number === number
    );

    if (selectedEpisode) {
      makePageForEpisodes([selectedEpisode]); // Show only selected episode
      updateEpisodeCount(1);
      
      // Scroll to the episode
      const episodeCard = document.querySelector(".episode-card");
      episodeCard.scrollIntoView({ behavior: "smooth" });
    }
  });
}