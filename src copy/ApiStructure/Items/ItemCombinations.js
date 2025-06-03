// All combinations of a specific item
// REQUEST: POST
// ENDPOINT: api/item-combinations
// params: {item: "B.F. Sword"}

// RESPONSE
{
  data: [
    {
      id: 1,
      name: "Giant Slayer",
      description: "Deal 10% bonus true damage",
      imageUrl:
        "http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/1011.png",
      components: ["B.F. Sword", "Recurve Bow"],
    },
    {
      id: 2,
      name: "Bloodthirster",
      description: "Heal for 40% of damage dealt",
      imageUrl:
        "http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/3072.png",
      components: ["B.F. Sword", "Vampiric Scepter"],
    },
    {
      id: 3,
      name: "Guardian Angel",
      description: "Revive with 400 Health",
      imageUrl:
        "http://ddragon.leagueoflegends.com/cdn/11.1.1/img/item/3026.png",
      components: ["B.F. Sword", "Chain Vest"],
    },
  ];
}
