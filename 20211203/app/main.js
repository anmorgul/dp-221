//listeners
document.querySelector('.on-search').addEventListener('click', onSearch);

const DATA = {
    input : document.querySelector('.inp-search'),
    output : document.querySelector('.output'),
    images : document.querySelector('.images'),
    links : {
        search : 'https://api.artic.edu/api/v1/artworks/search?q=',
        getImage : id => `https://www.artic.edu/iiif/2/${ id }/full/843,/0/default.jpg`,
        details : 'https://api.artic.edu/api/v1/artworks/'
    }
};

function onSearch(){
    const searchVal = DATA.input.value;
    console.log(searchVal, Date.now());
    DATA.images.innerHTML = '';
    loadData(searchVal);
}

function loadData(val){
    const searchLink = `${ DATA.links.search }${ val }`;
    fetch(searchLink)
        .then(r => r.json())
        .then(renderData);
}

function renderData(data){
    console.log(data);
    DATA.output.innerHTML = data.data.map(detailsController).join('');
}

function detailsController(artwork){
    loadDetails(artwork);
    return getHTML(artwork);
}

function loadDetails({ id }){
    const url = `${ DATA.links.details }${ id }`;
    fetch(url)
        .then(r => r.json())
        .then(d => {
            const imageURL = DATA.links.getImage(d.data.image_id);
            const imgHTML = `<img src="${ imageURL }">`;
            DATA.images.insertAdjacentHTML('beforeend', imgHTML);
        })
}

function getHTML(artwork){
    return `<div class="card m-1" style="width: 18rem;">
    <div class="card-body">
        <h5 class="card-title">${ artwork.title }</h5>
        <h6 class="card-subtitle mb-2 text-muted">${ artwork.id }</h6>
        <p class="card-text">${ artwork.thumbnail.alt_text }</p>
    </div>
    </div>`;
}