const API_URL = `https://api.themoviedb.org/3/movie`;
const SEARCH_API = `https://api.themoviedb.org/3/search`;
const API_KEY = `?api_key=82c53b18850117eee857022e723cc4d3`;
const elementNowPlaying = document.getElementById('nowPlaying');
const queryString = window.location.search; // untuk get url
const urlParams = new URLSearchParams(queryString); // untuk get parameter si movie_id
const elementDetails = document.getElementById('detailMovie');
const inputSearchMovie = document.getElementById('search');
const elementListMovie = document.getElementById("listMovie");

// EVENT LISTENER ON, IF SEARCH TYPING
inputSearchMovie.addEventListener("keyup", function (e) {
    const displayList = document.getElementById("sectionList");

    if (e.target.value == "") {
        displayList.style.display = "none";
    } else {
        displayList.style.display = "block";
        searchMovie(e.target.value);
    }

});

// SEARCH
function searchMovie(query) {
    fetch(`${SEARCH_API}/movie${API_KEY}&langue=en-US&query=${query}&page=1&include_adult=false`)
        .then((res) => res.json())
        .then((response) => {
            if (response.results) {
                renderList(response);
            }  
        })
        .catch((err) => console.log(err));
}

// RENDER SEARCH OUTPUT
function renderList(result) {
    elementListMovie.innerHTML = "";
    if (result.results.length > 0) {
        result.results.map((item, key) => {
            const elementLi = document.createElement("li");
            elementLi.innerHTML = `
                <li class="mt-2 flex">
                    <a class="flex items-center" href="details.html?movie_id=${item.id}">
                        <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" class="w-10" />
                        <span class="ml-5">${item.title}</span>
                    </a>
                </li>
            `;

            elementListMovie.appendChild(elementLi);
        });
    } else {
        elementListMovie.innerHTML = "<li>Not Found</li>";
    }
}

// GET DATA FROM API NOW PLAYING
function nowPlaying() {
    fetch(`${API_URL}/now_playing${API_KEY}`)
    .then((res) => res.json())
    .then((response) => {
        console.log(response.results);
        renderNowPlaying(response.results);
    });
}

// GET DATA FROM API DETAILS MOVIE
function getDetailMovie() {
    if (urlParams.has('movie_id')) {
        fetch(`${API_URL}/${urlParams.get('movie_id')}${API_KEY}`)
            .then((res) => res.json())
            .then((response) => {
                renderDetails(response); //call function render details
                console.log(response);
            });
    }
}

// RENDER NOW PLAYING
function renderNowPlaying(result) {
    result.map((item, key) => {
        const elementDiv = document.createElement("div");

        elementDiv.innerHTML = `
            <div class="rounded-lg shadow-xl">
                <a href="details.html?movie_id=${item.id}"> 
                    <img src="https://image.tmdb.org/t/p/w500/${
                        item.poster_path
                    }" class="w-95 md:w-46 rounded-t-lg hover:opacity-75"/>
                </a>
                <div class="px-2 mt-2">
                    <h3 class="text-gray-800 font-semibold">${item.title}</h3>
                    <div class="flex text-sm">
                        <span class="m-2"><i class="lni lni-star-filled text-yellow-500"></i></span>
                        <span class="m-2">${item.vote_average * 10}%</span>
                        <span class="m-2">${moment(item.release_date).format("MMM, DD YYYY")}</span>
                    </div>
                </div>
            </div>
        `;

        elementNowPlaying.appendChild(elementDiv);
    });
}

// RENDER DETAIL MOVIE
function renderDetails(result) {
    elementDetails.innerHTML = `
        <div class="flex flex-col md:flex-row">
            <div class="flex-none">
                <img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" class="w-56 md:w-46">
            </div>
            <div class="md:ml-24">
                <h1 class="text-2xl font-semibold">${result.title}</h1>
                <div class="flex mt-2 justify-start text-gray-600 font-semibold">
                    <span class="mx-2"><i class="lni lni-star-filled text-yellow-500"></i></span>
                    <span class="mx-2">${result.vote_average * 10}%</span>
                    <span class="mx-2">${moment(result.release_date).format("MMM, DD YYYY")}%</span>
                </div>
                <p class="mt-10 leading text-gray-600">${result.overview}</p>
                <a href="#" class="font-semibold bg-orange-500 text-center py-2 rounded-full px-5 mt-10 flex inline-flex hover:bg-orange-600 items-center">
                    <i class="lni lni-video mx-2"></i> Play Trailer
                </a>
            </div> 
        </div>
    `
}

nowPlaying();
getDetailMovie();