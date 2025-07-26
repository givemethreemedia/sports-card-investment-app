// lib/fetchSoldListings.ts

export function fetchSoldListingsMock() {
  return [
    {
      name: '2023 Bowman Chrome Elly De La Cruz',
      avgPrice: 32,
      image: 'https://example.com/image-elly.jpg',
      sport: 'Baseball',
      player: 'Elly De La Cruz',
      url: 'https://ebay.com/itm/elly-card'
    },
    {
      name: '2020 Prizm Justin Herbert',
      avgPrice: 28,
      image: 'https://example.com/image-herbert.jpg',
      sport: 'Football',
      player: 'Justin Herbert',
      url: 'https://ebay.com/itm/herbert-card'
    },
    {
      name: '2019 Prizm Zion Williamson',
      avgPrice: 40,
      image: 'https://example.com/image-zion.jpg',
      sport: 'Basketball',
      player: 'Zion Williamson',
      url: 'https://ebay.com/itm/zion-card'
    }
  ];
}
