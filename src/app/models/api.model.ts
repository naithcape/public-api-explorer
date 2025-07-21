export type ApiStatus = 'New' | 'Recommended' | 'Not Recommended';
export interface Api {
  id: number;
  name: string;
  link: string;
  description: string;
  votes_up: number;
  votes_down: number;
  status: ApiStatus;
  active: boolean;
}

export const INITIAL_APIS: Api[] = [
  {
    id: 1,
    name: "Cat Facts",
    link: "https://catfact.ninja/",
    description: "Random cat facts API.",
    votes_up: 0,
    votes_down: 0,
    status: "New",
    active: true
  },
  {
    id: 2,
    name: "Dog CEO's Dog API",
    link: "https://dog.ceo/dog-api/",
    description: "Random pictures of dogs.",
    votes_up: 0,
    votes_down: 0,
    status: "New",
    active: true
  },
  {
    id: 3,
    name: "OpenWeatherMap",
    link: "https://openweathermap.org/api",
    description: "Weather data from around the world.",
    votes_up: 0,
    votes_down: 0,
    status: "New",
    active: true
  },
  {
    id: 4,
    name: "REST Countries",
    link: "https://restcountries.com/",
    description: "Information about countries, borders, and more.",
    votes_up: 0,
    votes_down: 0,
    status: "New",
    active: true
  },
  {
    id: 5,
    name: "Public-apis.io",
    link: "https://public-apis.io/",
    description: "Lists various public APIs across categories.",
    votes_up: 0,
    votes_down: 0,
    status: "New",
    active: true
  },
  {
    id: 6,
    name: "IP Geolocation",
    link: "https://ip-api.com/",
    description: "IP geolocation API for finding location from IP.",
    votes_up: 0,
    votes_down: 0,
    status: "New",
    active: true
  },
  {
    id: 7,
    name: "NASA APIs",
    link: "https://api.nasa.gov/",
    description: "Space and astronomy-related public APIs from NASA.",
    votes_up: 0,
    votes_down: 0,
    status: "New",
    active: true
  },
  {
    id: 8,
    name: "JSONPlaceholder",
    link: "https://jsonplaceholder.typicode.com/",
    description: "Fake online REST API for testing and prototyping.",
    votes_up: 0,
    votes_down: 0,
    status: "New",
    active: true
  },
  {
    id: 9,
    name: "CoinGecko",
    link: "https://www.coingecko.com/api/documentation",
    description: "Cryptocurrency prices and data API.",
    votes_up: 0,
    votes_down: 0,
    status: "New",
    active: true
  },
  {
    id: 10,
    name: "PokeAPI",
    link: "https://pokeapi.co/",
    description: "Pokémon data accessible via a free API.",
    votes_up: 0,
    votes_down: 0,
    status: "New",
    active: true
  }
];
