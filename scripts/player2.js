let player2 = load_player2()

function load_player2 () {
    return {
        id: 2,
        name: "Ash Ketchum",
        pokemons: [
            { name: "meganium", moves: ["giga-drain", "toxic", "bullet-seed"]},
            { name: "empoleon", moves: ["swagger", "ice-beam", "hydro-pump", "swords-dance"] },
            { name: "milotic", moves: ["recover", "surf"] },
            { name: "raticate", moves: ["tackle", "swords-dance"] },
            { name: "venusaur", moves: ["razor-leaf"] },
            { name: "magikarp", moves: ["tackle"] }
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