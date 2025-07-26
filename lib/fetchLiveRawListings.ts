import axios from 'axios';

const EBAY_API_ENDPOINT = 'https://api.ebay.com/buy/browse/v1/item_summary/search';

export async function fetchLiveRawListings(query: string, accessToken: string) {
  const url = `${EBAY_API_ENDPOINT}?q=${encodeURIComponent(query)} -psa -bgs -sgc&filter=buyingOptions:{AUCTION|FIXED_PRICE},price:[10..250],conditions:{1000},availability=IN_STOCK&limit=20&sort=price`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      },
    });

    return response.data.itemSummaries.map((item: any) => ({
      title: item.title,
      price: item.price.value,
      currency: item.price.currency,
      image: item.image?.imageUrl,
      itemUrl: item.itemWebUrl,
      endTime: item.itemEndDate,
      listingId: item.itemId,
    }));
  } catch (error) {
    console.error('Error fetching raw listings:', error);
    return [];
  }
}
