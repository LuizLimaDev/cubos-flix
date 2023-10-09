const api = axios.create({
  baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover',
  timeout: 5000,
  headers: { 'Content-Type': 'Application/json' }
});

async function getData() {
  try {
    const response = await api.get('/movie?language=pt-BR&include_adult=false');
    const data = await response.data.results;

    let totalOfMovies = [];
    totalOfMovies = data.slice(0, 18);

    return totalOfMovies;

  } catch (erro) {
    console.log(erro)
  }
}
