let pokemon_url = "https://pokeapi.co/api/v2/pokemon/"
let move_url = "https://pokeapi.co/api/v2/move/"

let dv = 31
let ev = 10
let level = 100

async function load_data (player) {
    for (let i = 0; i < player.pokemons.length; i++) {
        pokemon = await $.get(pokemon_url + player.pokemons[i].name)
        
        player.pokemons[i].id = pokemon.id
        player.pokemons[i].name = pokemon.name
        player.pokemons[i].sprites = pokemon.sprites
        player.pokemons[i].type = pokemon.types
        player.pokemons[i].evasion_stage = 0
        player.pokemons[i].accuracy_stage = 0
        
        for (let j = 0; j < pokemon.stats.length; j++) {
            let stat = pokemon.stats[j]
            let stat_name = stat.stat.name
            let base = stat.base_stat

            player.pokemons[i][stat_name] = Math.floor(((2 * (base + dv) + Math.sqrt(ev)/4) * level) / 100);
            player.pokemons[i][stat_name] += 5

            player.pokemons[i][stat_name + "_stage"] = player.pokemons[i][stat_name]
        }

        player.pokemons[i].hp += level + 5
        player.pokemons[i].max_hp = player.pokemons[i].hp
        
        player.pokemons[i].status = []

        let moves = []
        for (let j = 0; j < pokemon.moves.length; j++) {
            moves.push(pokemon.moves[j].move.name)
        }
        let allowed = ["damage", "net-good-stats", "heal", "ailment", "damage+ailment", "swagger", "damage+lower", "damage+raise", "damage+heal", "ohko"]
        for (let j = 0; j < player.pokemons[i].moves.length; j++) {
            let name = player.pokemons[i].moves[j]
            
            if (moves.indexOf(name) == -1) {
                alert("[ERROR] " + name.toUpperCase() + " not in the moves of " + pokemon.name.toUpperCase() + ".")
                throw new Error()
            }

            let move = await $.get(move_url + name)
            delete move.contest_effect
            delete move.contest_combos
            delete move.contest_type
            delete move.flavor_text_entries
            delete move.generation
            delete move.machines
            delete move.names
            delete move.past_values
            delete move.super_contest_effect


            if (allowed.indexOf(move.meta.category.name) == -1) {
                alert("[ERROR] " + name.toUpperCase() + " is not included in the allowed moves.")
                throw new Error()
            }

            move.max_pp = move.pp
            player.pokemons[i].moves[j] = move
        }
    }
    
    return player
}

