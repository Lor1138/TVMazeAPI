/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const MISSING_IMAGE = "https://tinyurl.com/tv-missing";

async function searchShows(query) {
  let res = await axios.get(`https://api.tvmaze.com/search/shows?q=:${query}`);
  let tvShows = res.data.map(results => {
  let tvShow =  results.show;
  return { id: tvShow.id, 
           name: tvShow.name, 
           summary: tvShow.summary,
           image: tvShow.image ? tvShow.image.medium : MISSING_IMAGE
          }
    });
    return tvShows
    
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(tvShows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of tvShows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <img class="card-img-top" src="${show.image}">
             <button type="button" class="btn btn-info get-episode-list">Get Episode List</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {

      let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
      
      let tvEpisodes = response.data.map(episodes => ({
                 id: episodes.id,
                 name: episodes.name,
                 season: episodes.season,
                 number: episodes.number
          }));
          
          return tvEpisodes;

  // TODO: return array-of-episode-info, as described in docstring above
}


function populateEpisodes(tvEpisodes) {
  const $episodeList = $("#episodes-list");
  $episodeList.empty();

  for (let episode of tvEpisodes) {
    let $item = $(
      `<li> Episode Title: ${episode.name} 
          (Season: ${episode.season} Episode: ${episode.number})</li>`
     
    );

    $episodeList.append($item);
  }
  $("#episodes-area").show();
}


$("#shows-list").on("click", ".get-episode-list", async function handleClickEpisode (evt) {
  evt.preventDefault();

  let episodesID = $(evt.target).closest(".Show").data("show-id")
  let episodes = await getEpisodes(episodesID);

  populateEpisodes(episodes);
});
