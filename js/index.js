const API_KEY = "AIzaSyBwV9woxcNwsddGK6n0lEn9Jx0fiWEXv3s";

function fetchVideos(searchTerm,data){
    var url;
    if (data == "none") {
      url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&key=${API_KEY}&q=${searchTerm}&type=video`;
    } else {
      url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&key=${API_KEY}&q=${searchTerm}&type=video&pageToken=${data}`;
    }

    let settings = {
        method : 'GET'
    };
    console.log( url );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            displayResults(searchTerm,responseJSON);
        })
        .catch( err => {
            console.log(err);
        });
}

function displayResults(searchTerm,data){
    var ant = ""
    let results = document.querySelector( '.results' );

    results.innerHTML = "";
    console.log(data);
    for( let i = 0; i < data.items.length; i ++ ){
      results.innerHTML += `
      <div class="four wide column">
        <div class="ui card">
          <a href="https://www.youtube.com/watch?v=${data.items[i].id.videoId}" target="_blank" class="ui medium image">
              <img src=${data.items[i].snippet.thumbnails.medium.url}>
          </a>
          <div class="content">
            <a href="https://www.youtube.com/watch?v=${data.items[i].id.videoId}"class="header" target="_blank">
              ${data.items[i].snippet.title}
            </a>
          </div>
        </div>
      </div>
      `
    }
    if (data.prevPageToken == null) {
      ant = "disabled";
    } else {
      ant = "positive";
    }

    results.innerHTML += `
    <div class="fluid ui large buttons">
      <button class="ui ${ant} button backButton">Back</button>
      <div class="or"></div>
      <button class="ui primary button nextButton">Next</button>
    </div>
    `
    let nextButton = document.querySelector( '.nextButton' );
    let backButton = document.querySelector( '.backButton' );
    nextButton.addEventListener( 'click', ( event ) => {
        event.preventDefault();
        fetchVideos( searchTerm, data.nextPageToken);
    });
    backButton.addEventListener( 'click', ( event ) => {
        event.preventDefault();
        fetchVideos( searchTerm, data.prevPageToken);
    });
}

function watchForm(){
    let submitButtton = document.querySelector( '.submitButtton' );

    submitButtton.addEventListener( 'click', ( event ) => {
        event.preventDefault();
        let searchTerm = document.querySelector( '#searchTerm' ).value;

        fetchVideos( searchTerm,"none");
    });
}

function init(){
    watchForm();
}

init();
