// TODO: Make AI smarter
let player1 = load_player1()

function load_player1 () {
    return {
        id: 1,
        name: "Red",
        pokemons: [
            { name: "dragonite", moves: ["thunderbolt", "ice-beam", "hyper-beam", "blizzard"] },
            { name: "tyranitar", moves: ["giga-impact", "crunch", "rock-slide", "earthquake"] },
            { name: "charizard", moves: ["flamethrower", "fire-spin", "fire-blast", "dragon-pulse"] },
            { name: "gardevoir", moves: ["psychic", "shadow-ball", "moonblast", "hypnosis"] },
            { name: "pidgeot", moves: ["sky-attack", "quick-attack", "agility", "air-slash"] },
            { name: "arbok", moves: ["toxic", "poison-jab", "acid", "screech"]}
        ],
        think_menu (self, enemy_trainer) {
            // 0 - FIGHT, 1 - SWITCH
            let choice = Math.floor(Math.random()*2)
            return choice
        },
        think_move (current_pokemon, enemy_pokemon) {
            // 0 BASED ARRAY
            let choice = Math.floor(Math.random()*current_pokemon.moves.length)

            return choice
        },
        think_switch (current_pokemon, enemy_pokemon, current_team) {
            let n = 0
            
            for (let i = 0; i < current_team.length; i++) {
                if (current_team[i].name == current_pokemon.name && current_team[i].hp != 0) {
                    n++
                }
            }

            let choice = Math.floor(Math.random()*n)
            return choice
            
        }
    }
}