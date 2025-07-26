// lib/fetchSoldListingsMock.ts

export const fetchSoldListingsMock = async () => {
  return [
    {
      name: '2024 Donruss Jayden Daniels Optic Preview Pink',
      avgPrice: 18.5,
      image: 'https://example.com/jayden-daniels-raw.jpg',
      sport: 'Football',
      player: 'Jayden Daniels',
      url: 'https://www.ebay.com/itm/example1'
    },
    {
      name: '2023 Bowman Chrome Elly De La Cruz Auto',
      avgPrice: 135.0,
      image: 'https://example.com/elly-raw.jpg',
      sport: 'Baseball',
      player: 'Elly De La Cruz',
      url: 'https://www.ebay.com/itm/example2'
    },
    {
      name: '2020 Prizm Justin Herbert Rookie',
      avgPrice: 52.0,
      image: 'https://example.com/herbert-raw.jpg',
      sport: 'Football',
      player: 'Justin Herbert',
      url: 'https://www.ebay.com/itm/example3'
    }
  ];
};
