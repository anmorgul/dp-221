//listeners
document.querySelector(".on-search").addEventListener("click", onSearch);
// document.querySelector(".on_clear").addEventListener("click", dropAll);

const DATA = {
  input: document.querySelector(".inp-search"),
  output: document.querySelector(".output"),
  // images: document.querySelector(".images"),
  links: {
    search: "https://api.artic.edu/api/v1/artworks/search?q=",
    getImage: (id) =>
      `https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg`,
    details: "https://api.artic.edu/api/v1/artworks/",
  },
};

function onSearch() {
  removeContent();
  const searchVal = DATA.input.value;
  console.log(searchVal, Date.now());
  loadData(searchVal);
};

function loadData(val) {
  const searchLink = `${DATA.links.search}${val}`;
  fetch(searchLink)
    .then((r) => r.json())
    .then(renderData);
};

function renderData(data) {
  if (data.data.length) {
    data.data.map(getHTML);
  } else {
    DATA.output.insertAdjacentHTML("beforeend",
      `<div>¡Nothing found! :(</div>`
      );
  };
};

function getHTML(artwork) {
  partHTML = `<div class="card m-1" style="width: 18rem;">
      <div class="card-body">
        <div id=img${artwork.id} d-flex flex-wrap">
          <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <h5 class="card-title">${artwork.title}</h5>
        <h6 class="card-subtitle mb-2 text-muted">ID:${artwork.id}</h6>
        <p class="card-text">${artwork.thumbnail.alt_text}</p>
        <footer>
          <small id=auth${artwork.id} class="text-muted">
            <div class="d-flex justify-content-center">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </small>
        </footer>
      </div>
    </div>`;
  DATA.output.insertAdjacentHTML("beforeend", partHTML);
  getdetails(artwork);
};

function getdetails(artwork) {
  const url = `${artwork.api_link}`;
  const details = fetch(url)
    .then((r) => r.json())
    .then((details) => {
      const imageURL = DATA.links.getImage(details.data.image_id);
      const imgHTML = `<img  class="card-img-top"  src="${imageURL} ">`;
      const oneImage = document.querySelector(`#img${artwork.id}`);
      const author = document.querySelector(`#auth${artwork.id}`);
      oneImage.innerHTML = "";
      oneImage.insertAdjacentHTML("beforeend", imgHTML);
      author.innerHTML = details.data.artist_title || "Author unknown";
    });
};

// function dropAll() {
//   removeContent();
//   DATA.input.value = "";
// };

function removeContent() {
  DATA.output.innerHTML = "";
};
