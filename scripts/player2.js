let player2 = load_player2()

function load_player2 () {
    return {
        id: 2,
        name: "Ash Ketchum",
        pokemons: [
            { name: "blissey", moves: ["soft-boiled", "toxic", "seismic-toss", "thunder-wave"] },
            { name: "garchomp", moves: ["draco-meteor", "stone-edge", "iron-head", "earthquake"]},
            { name: "slaking", moves: ["retaliate", "sucker-punch", "earthquake", "fire-blast"] },
            { name: "gardevoir", moves: ["psyshock", "will-o-wisp", "moonblast", "psychic"] },
            { name: "blaziken", moves: ["high-jump-kick", "stone-edge", "flare-blitz", "swords-dance"] },
            { name: "pikachu", moves: ["quick-attack", "thunderbolt", "iron-tail", "thunder"] }
        ],
        think_menu (self, enemy_trainer) {
            // 0 - FIGHT, 1 - SWITCH
            let choice = Math.floor(Math.random()*2)
            console.log("CHOICE: " + choice)
            return choice
        },
        think_move (current_pokemon, enemy_pokemon) {
            // 0 BASED ARRAY
            let choice = Math.floor(Math.random()*current_pokemon.moves.length)
            console.log("CHOICE: " + choice)

            return choice
        },
        think_switch (current_pokemon, enemy_pokemon, current_team) {
            let n = 0
            
            for (let i = 0; i < current_team.length; i++) {
                if (current_team[i].name != current_pokemon.name && current_team[i].hp != 0) {
                    n++
                }
            }

            let choice = Math.floor(Math.random()*n)
            console.log("CHOICE: " + choice)
            return choice
            
        }
    }
}