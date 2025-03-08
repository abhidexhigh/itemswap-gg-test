// All details of a champion
// REQUEST: POST
// ENDPOINT: api/champion-details
// params: {champion: "Aatrox"}

// RESPONSE
{
  data: [
    {
      id: 1,
      name: "Aatrox",
      imageUrl:
        "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/Aatrox.png",
      origin: "Divine",
      class: "Vanguard",
      price: 4,
      ability: {
        name: "The Darkin Blade",
        description:
          "Aatrox slams his greatsword down, dealing 250 / 500 / 1000 magic damage to all enemies in the area. Enemies hit are also knocked up for 1.5 seconds.",
      },
      recommendedItems: [
        {
          name: "Sunfire Aegis",
          imageUrl:
            "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/3068.png",
        },
        {
          name: "Spirit Visage",
          imageUrl:
            "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/3065.png",
        },
        {
          name: "Ninja Tabi",
          imageUrl:
            "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/3047.png",
        },
      ],
      stats: {
        health: 750,
        armor: 35,
        magicResist: 30,
        attackDamage: 70,
        attackSpeed: 1.0,
      },
      traits: [
        {
          name: "Divine",
          description:
            "Upon attacking six times or dropping below 50% health, Divine champions ascend, taking 25% reduced damage and dealing 10% bonus true damage for the rest of combat.",
        },
        {
          name: "Vanguard",
          description: "Vanguards gain bonus armor.",
        },
      ],
    },
  ];
}
