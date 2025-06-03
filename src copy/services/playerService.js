import playersData from "../data/players.json";

/**
 * Service to handle player-related operations
 */
export const playerService = {
  /**
   * Get all players
   * @returns {Promise<Array>} Array of player objects
   */
  getAllPlayers: async () => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(playersData.players);
      }, 300);
    });
  },

  /**
   * Search players by username
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching player objects
   */
  searchPlayers: async (query) => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query || query.trim() === "") {
          resolve([]);
          return;
        }

        const filteredPlayers = playersData.players.filter((player) =>
          player.username.toLowerCase().includes(query.toLowerCase())
        );

        resolve(filteredPlayers);
      }, 300);
    });
  },

  /**
   * Get player by username
   * @param {string} username - Player username
   * @returns {Promise<Object|null>} Player object or null if not found
   */
  getPlayerByUsername: async (username) => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const player = playersData.players.find(
          (p) => p.username.toLowerCase() === username.toLowerCase()
        );

        resolve(player || null);
      }, 300);
    });
  },
};

export default playerService;
