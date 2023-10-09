const movieContainer = document.querySelector('.movies');
const searchInput = document.querySelector('.input');
const prevButton = document.querySelector('.btn-prev');
const nextButton = document.querySelector('.btn-next');
const highlightTitle = document.querySelector('.highlight__title');
const modalClose = document.querySelector('.modal__close');

let page = 0;
let moviesPerPage = 6;

function init() {
  render(page, moviesPerPage, getData())
  navigation(page, moviesPerPage, getData())
  searchMovies(page, moviesPerPage)
  movieOfDay()
  theme()
}
init()

function cardBuild(backgroundImg, title, rating, id) {
  const card = document.createElement('div');
  card.classList.add('movie');

  let content = '';

  //card content
  card.style.backgroundImage = `url(${backgroundImg})`;

  content = `
    <div class="movie__info" id='${id}'> 
      <span class="movie__title">${title}</span>
      <span class="movie__rating">
        ${rating}
        <img src="./assets/estrela.svg" alt="estrela">
      </span>
    </div>
  `;

  card.innerHTML = content;

  return card;
}

async function render(page, moviesPerPage, api) {
  const dataMovie = await api;
  movieContainer.innerHTML = '';

  dataMovie.slice(page, moviesPerPage).forEach(movie => {
    movieContainer.appendChild(cardBuild(movie.poster_path, movie.title, movie.vote_average, movie.id))
  });

  modal();
}

async function navigation(page, moviesPerPage, api) {
  const data = await api;
  let totalOfMovies = data.length;

  //btn prev
  prevButton.addEventListener('click', () => {
    if (page <= 0) {
      page = totalOfMovies - moviesPerPage;
      moviesPerPage = totalOfMovies;
      render(page, moviesPerPage, api);

    } else {
      page -= 6;
      moviesPerPage -= 6;
      render(page, moviesPerPage, api);
    }
  });

  //btn next
  nextButton.addEventListener('click', () => {
    if (moviesPerPage >= totalOfMovies) {
      page = 0;
      moviesPerPage = 6;
      render(page, moviesPerPage, api);

    } else {
      page += 6;
      moviesPerPage += 6;
      render(page, moviesPerPage, api);
    }
  });
}

function searchMovies(page, moviesPerPage) {
  searchInput.addEventListener('keypress', (event) => {
    const movieSearched = searchInput.value;

    if (!movieSearched) {
      page = 0;
      moviesPerPage = 6;
      render(page, moviesPerPage, getData());
    }

    if (event.key === 'Enter' && movieSearched) {
      async function searching() {
        let searchMovie = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${movieSearched}`);
        const data = searchMovie.data.results;

        let totalOfMovies;
        totalOfMovies = data.slice(0, 18);

        render(page, moviesPerPage, totalOfMovies)
        navigation(page, moviesPerPage, totalOfMovies)

        return totalOfMovies
      }

      searching()

      searchInput.value = '';
    }
  });
}

async function movieOfDay() {
  const response = await axios.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR`);
  const data = response.data;

  const highlightVideoBackground = document.querySelector('.highlight__video');
  const highlightRating = document.querySelector('.highlight__rating');
  const highlightDescription = document.querySelector('.highlight__description');
  const highlightVideo = document.querySelector('.highlight__video-link');
  const highlightGenres = document.querySelector('.highlight__genres');
  const highlightLaunch = document.querySelector('.highlight__launch');

  //info
  const genres = data.genres;
  const allGenres = `${genres[0].name}, ${genres[1].name}, ${genres[2].name}`;

  highlightVideoBackground.style.background = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${data.backdrop_path})`;
  highlightVideoBackground.style.backgroundSize = 'cover';

  highlightTitle.textContent = data.title;
  highlightRating.textContent = data.vote_average.toFixed(1);
  highlightGenres.textContent = allGenres;
  highlightDescription.textContent = data.overview;

  const currentDate = data.release_date;
  const formatDate = new Date(currentDate).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  highlightLaunch.textContent = formatDate;

  //video
  const videoResponse = await axios.get('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');
  const videoData = videoResponse.data.results[0];
  highlightVideo.href = `https://www.youtube.com/watch?v=${videoData.key}`;
}

function modal() {
  const modal = document.querySelector('.modal');
  const movie = document.querySelectorAll('.movie')

  //modal close
  modal.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  //search movie by id
  movie.forEach(movie => {
    let id = movie.firstElementChild.id;
    movie.addEventListener('click', () => {
      modal.classList.remove('hidden');

      async function modalInfos() {
        const response = await axios.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`)
        const data = response.data;

        const modalTitle = document.querySelector('.modal__title');
        const modalImg = document.querySelector('.modal__img');
        const modalDescription = document.querySelector('.modal__description');
        const modalAvarage = document.querySelector('.modal__average');
        const modalGenre = document.querySelector('.modal__genres');

        //card 
        modalTitle.textContent = data.title;
        if (modalTitle.textContent.length) {
          modalTitle.style.fontSize = '26px';
        }

        modalImg.src = data.backdrop_path;
        modalDescription.textContent = data.overview;
        modalAvarage.textContent = data.vote_average.toFixed(1);

        modalGenre.innerHTML = '';

        data.genres.forEach(item => {
          const genre = document.createElement('span');
          genre.classList.add('modal__genre');
          modalGenre.appendChild(genre);
          genre.textContent = item.name;
        });
      }
      modalInfos()

    });
  })
}

function theme() {
  const root = document.querySelector(':root');
  const themeBtn = document.querySelector('.btn-theme');
  const headerLogo = document.querySelector('.header__logo');

  function darkTheme() {
    themeBtn.src = './assets/dark-mode.svg';

    root.style.setProperty('--background', '#1b2028');
    root.style.setProperty('--bg-secondary', '#2D3440');
    root.style.setProperty('--text-color', '#fff');
    root.style.setProperty('--input-color', '#fff');
    searchInput.style.backgroundColor = '#3E434D';
    searchInput.style.borderColor = '#665F5F';

    headerLogo.src = './assets/logo.svg';
    prevButton.src = './assets/arrow-left-light.svg';
    nextButton.src = './assets/arrow-right-light.svg';
    modalClose.src = './assets/close.svg';
  };

  function lightTheme() {
    themeBtn.src = './assets/light-mode.svg';

    root.style.setProperty('--background', '##fff');
    root.style.setProperty('--bg-secondary', '#ededed');
    root.style.setProperty('--text-color', '#1b2028');
    root.style.setProperty('--input-color', '#979797');
    searchInput.style.backgroundColor = '#fff';
    searchInput.style.borderColor = '#979797';

    headerLogo.src = './assets/logo-dark.png';
    prevButton.src = './assets/arrow-left-dark.svg';
    nextButton.src = './assets/arrow-right-dark.svg';
    modalClose.src = './assets/close-dark.svg';
  };

  //theme checker
  themeBtn.addEventListener('click', () => {
    const themeChecker = themeBtn.src.includes('dark');
    console.log(themeChecker)

    if (!themeChecker) {
      darkTheme()
    } else {
      lightTheme()
    }
  });
}
