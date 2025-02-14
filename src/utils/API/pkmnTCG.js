const pokemon = require("pokemontcgsdk");
const API_KEY = process.env.API_KEY;
pokemon.configure({ apiKey: API_KEY });

const getRandomCard = (data) => {
    return Math.floor(Math.random() * data.length)
}

module.exports = {
  getSet: async (query) => {
    try {
      const result = await pokemon.card.where({ q: `set.id:${query}` })
      const pkmn = result.data[getRandomCard(result.data)]
      return pkmn; // Return the result instead of logging it
    } catch (error) {
      console.error("Error fetching card by name:", error);
      throw error; // Throw the error so it can be handled by the caller
    }
  },
  singlePkmn: async (set) => {
    try {
      const result = await pokemon.card.find("base1-4");
      return result; // Return the result instead of logging it
    } catch (error) {
      console.error("Error fetching card by name:", error);
      throw error; // Throw the error so it can be handled by the caller
    }
  },
};