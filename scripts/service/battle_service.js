let battleOngoing = false
let statusCheck = false

let battle_application = new Vue ({
    el: "#battle",
    data: {
        player1: {
            pokemons: []
        },
        player2: {
            pokemons: []
        },
        message: [ 
            "",
            ""
        ],
        action_keys: [
            [], 
            []  
        ],
        actions: [
            [], 
            []
        ],
        fields: [
            {   
                "status": {

                }
            },
            {
                "status": {

                }
            }
        ],
        animation: {
            "pokemon1": "",
            "pokemon2": ""
        },
        queue: [],
        status_data: {
            "PARALYSIS": { color: "yellow-400" },
            "POISON": { color: "purple-300" },
            "CONFUSION": { color: "gray-400" },
            "BURN": { color: "red-400" },
            "FREEZE": { color: "blue-400" },
            "TRAP": { color: "purple-400" },
            "SLEEP": { color: "pink-400" }
        },
        type_data: {
            "normal": { color: "bg-gray-600 text-white"},
            "fire": { color: "bg-red-600 text-white"},
            "water": { color: "bg-blue-600 text-white"},
            "fighting": { color: "bg-red-600 text-white"},
            "electric": { color: "bg-yellow-600 text-black"},
            "grass": { color: "bg-green-600 text-white"},
            "ice": { color: "bg-blue-200 text-black"},
            "ground": { color: "bg-orage-800 text-white"},
            "poison": { color: "bg-purple-300 text-black"},
            "flying": { color: "bg-blue-400 text-black"},
            "psychic": { color: "bg-purple-600 text-white"},
            "bug": { color: "bg-green-900 text-white"},
            "ghost": { color: "bg-purple-900 text-white"},
            "rock": { color: "bg-gray-800 text-white"},
            "dragon": { color: "bg-red-900 text-white"},
            "dark": { color: "bg-black text-white"},
            "steel": { color: "bg-gray-300 text-black"},
            "fairy": {color: "bg-pink-600 text-white"}
        },
        skipTurn: [false, false],
        sleepCount: [0, 0],
        freezeCount: [0, 0],
        trapCount: [0, 0]
     },
    methods: {
        endTurn: function () {
            console.log("-- ENDING TURN --")

            Vue.set(this.message, 0, "")
            Vue.set(this.message, 1, "")

            this.queue = []

            this.statusCheck(1, () => {
                this.set_main_menu(1)
            })
            this.statusCheck(2, () => {
                this.set_main_menu(2)
            })


            this.animation = {
                "pokemon1": "",
                "pokemon2": ""
            }
        },
        statusCheck: function (player, callback) {
            let queue = []

            let player_obj = player == 1 ? this.player1 : this.player2
            let pokemon_obj = player_obj.pokemons[0]
            
            if (pokemon_obj.status.indexOf("SLEEP") != -1) {
                let sleepRNG = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
                if (sleepRNG == 1 && sleepCount[player-1] < 4) {
                    Vue.set(this.message, player-1, pokemon_obj.name.toUpperCase() + " continues to sleep!");
                    this.sleepCount[player-1]++;
                    this.skipTurn[player-1] = true;
                    return
                } else {
                    pokemon_obj.status.splice(pokemon_obj.status.indexOf("SLEEP"), 1)
                    this.skipTurn[player-1] = false;
                    Vue.set(this.message, player-1, pokemon_obj.name.toUpperCase() + " woke up!");
                    setInterval(() => { Vue.set(this.message, player-1, null) }, 1000)
                    this.sleepCount[player-1] = 0;
                    if (callback) callback()
                    return
                }
            }

            if (pokemon_obj.status.indexOf("PARALYSIS") != -1) {
                let paralysisRNG = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
                if (paralysisRNG == 1) {
                    console.log(pokemon_obj.name.toUpperCase() + " is paralyzed! It can't move!")
                    Vue.set(this.message, player-1, pokemon_obj.name.toUpperCase() + " is paralyzed! It can't move");
                    this.skipTurn[player-1] = true;
                    battle_application.queue.push({
                        execute (callback) {
                            Vue.set(battle_application.message, player-1, "");
                            if (callback)
                                callback()
                        },
                        priority: -9
                    })
                    return
                } else {
                    this.skipTurn[player-1] = false;
                    if (callback) callback()
                    return
                }
            }

            if (pokemon_obj.status.indexOf("POISON") != -1) {
                let msg = "[" + player_obj.name.toUpperCase() + "] " + pokemon_obj.name.toUpperCase() + " is hurt by poison"
                Vue.set(this.message, player-1, msg);
                console.log(msg)

                this.updateHP(player, -Math.round(pokemon_obj.max_hp/8), () => {
                    Vue.set(this.message, player-1, "")
                    if (callback) callback()
                })
                return
            }

            if (pokemon_obj.status.indexOf("BURN") != -1) {
                let msg = "[" + player_obj.name.toUpperCase() + "] " + pokemon_obj.name.toUpperCase() + " is hurt by its burn."
                Vue.set(this.message, player-1, msg);
                console.log(msg)
                
                this.updateHP(player, -Math.round(pokemon_obj.max_hp/8), () => {
                    Vue.set(this.message, player-1, "")
                    if (callback) callback()
                })
                return
            }

            if (pokemon_obj.status.indexOf("TRAP") != -1) {
                if (this.trapCount[player-1] < 5) {
                    let msg = "[" + player_obj.name.toUpperCase() + "] " + pokemon_obj.name.toUpperCase() + " is trapped in a vortex."
                    Vue.set(this.message, player-1, msg);
                    console.log(msg)
                    
                    this.updateHP(player, -Math.round(pokemon_obj.max_hp/8), () => {
                        Vue.set(this.message, player-1, "")
                        if (callback) callback()
                    })
                    this.trapCount[player-1] ++
                    return
                } else {
                    this.trapCount[player-1] = 1
                    pokemon_obj.status = []
                }
            }

            if (pokemon_obj.status.indexOf("FREEZE") != -1) {
                let freezeRNG = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
                if (freezeRNG == 2 && this.freezeCount[player-1] < 5) {
                    console.log(pokemon_obj.name.toUpperCase() + " is frozen solid!")
                    Vue.set(this.message, player-1, pokemon_obj.name.toUpperCase() + " is frozen solid!");
                    battle_application.queue.push({
                        execute (callback) {
                            Vue.set(battle_application.message, player-1, "");
                            if (callback)
                                callback()
                        },
                        priority: -9
                    })
                    this.skipTurn[player-1] = true;
                    this.freezeCount[player-1]++;
                    if (callback) callback()
                    return
                } else {
                    let a = []
                    pokemon_obj.status.splice(pokemon_obj.status.indexOf("FREEZE"), 1)
                    this.skipTurn[player-1] = false;
                    Vue.set(this.message, player-1, "[" + player_obj.name + "] " + pokemon_obj.name.toUpperCase() + " thawed out of the ice!");
                    setTimeout(() => { Vue.set(this.message, player-1, null) }, 1000)
                    console.log("[" + player_obj.name + "] " + pokemon_obj.name.toUpperCase() + " thawed out of the ice!");
                    this.freezeCount[player-1] = 0;

                    if (callback) callback()
                    return
                }
            }

            if (callback) callback()
            return pokemon_obj
        },
        updateHP: function (player_id, hp_delta, callback, next) {
            let updating
            let duration = Math.abs(1000/hp_delta)

            let player = player_id == 1 ? player1 : player2
            let target_hp = hp_delta + player.pokemons[0].hp
            updating = setInterval(() => {
                if (player.pokemons[0].hp == target_hp) {
                    clearInterval(updating)
                    if (callback) callback(next)
                    return 
                }

                if (player.pokemons[0].hp < target_hp)
                    player.pokemons[0].hp ++
                if (player.pokemons[0].hp > target_hp)
                    player.pokemons[0].hp --

                if (player.pokemons[0].hp <= 0 ||
                    player.pokemons[0].hp >= player.pokemons[0].max_hp) {
                    
                    clearInterval(updating)
                    if (player.pokemons[0].hp <= 0) {
                        if (callback) 
                            callback(() => {
                                console.log("[" + player.name.toUpperCase() + "] " + player.pokemons[0].name.toUpperCase() + " fainted!")
                                player.pokemons[0].status = []
                        
                                battle_application.animation.pokemon1 = ""
                                battle_application.animation.pokemon2 = ""
                                if (player.name == player1.name) 
                                    battle_application.animation.pokemon1 = "animated shake"
                                else 
                                    battle_application.animation.pokemon2 = "animated rotateOutDownLeft"

                                Vue.set(battle_application.message, player_id-1, "[" + player.name + "] " + player.pokemons[0].name.toUpperCase() + " fainted!")
                                
                                setTimeout(() => {
                                    Vue.set(battle_application.message, player_id-1, "")
                                        
                                    battle_application.switch(player, battle_application.actions[0], battle_application.action_keys[0], true)
                                }, 1000)
                            })
                        return
                    }

                    if (callback) callback(next)
                }
            }, duration)
        },
        choose_move: function (player, pokemon, move_id) {
            let move = pokemon.moves[move_id]
            let enemy = player.name == this.player1.name ? this.player2.pokemons[0] : this.player1.pokemons[0]
            
            if (move.pp <= 0) {
                Vue.set(this.message, player.name == player1.name ? 0: 1, "No more pp!")
                setTimeout(() => {
                    Vue.set(this.message, player.name==player1.name ? 0: 1, "")
                    battle_application.set_main_menu(player.name==player1.name ? 1 : 2)
                }, 1000)
                return
            }

            Vue.set(this.message, player.name==player1.name ? 0: 1, "Waiting for " + (player.name==player1.name?player2.name.toUpperCase():player1.name.toUpperCase()))
            this.queue.push({
                execute (callback) {
                    move.pp -= 1

                    let msg = "[" + player.name.toUpperCase() + "] " + pokemon.name.toUpperCase() + " used " + move.name.replace("-", " ").toUpperCase() + "!"
                    Vue.set(battle_application.message, player.name==player1.name ? 0: 1, msg)
                    console.log(msg)

                    let target
                    let enemy = player.name == battle_application.player1.name 
                                ? battle_application.player2.pokemons[0] 
                                : battle_application.player1.pokemons[0]
            
                    setTimeout(() => {
                        
                        switch(move.target.name) {
                            case "all-opponents":
                            case "random-pokemon":
                            case "selected-pokemon":
                            case "all-other-pokemon":
                            case "all-opponents":
                            case "selected-pokemon-me-first":
                                target = enemy
                            break;
                            case "users-field":
                            case "user-or-ally":
                            case "user-and-allies":    
                            case "user":
                                target = pokemon
                            break;
                            case "all-pokemon":
                                target = [pokemon, enemy]
                            break;
                            case "opponents-field":
                                target = [player.name == player1.name ? player2.field : player1.field]
                            break;
                            case "users-field":
                                target = [player.name == player1.name ? player1.field : player2.field]
                            break;
                            case "entire-field":
                                target = [player1.field, player2.field]
                            break;
                            default:
                                if (callback) callback()
                            break;
                        }

                        switch (move.meta.category.name) {
                            case "ohko":
                                battle_application.damage(player, pokemon, target, move, () => {
                                    if (callback)  callback()
                                }, true)
                            break;
                            case "damage":
                                battle_application.damage(player, pokemon, target, move, () => {
                                    if (callback)  callback()
                                }, false)
                            break;
                            case "ailment":
                                battle_application.ailment(player, pokemon, target, move, () => {
                                    if (callback)  callback()
                                })
                            break;
                            case "net-good-stats":
                                battle_application.status_change(player, pokemon, target, move, () => {
                                    if (callback)  callback()
                                })
                            break;
                            case "damage+ailment":
                                battle_application.damage_ailment(player, pokemon, target, move, () => {
                                    if (callback)  callback()
                                })
                            break;
                            case "heal":
                                battle_application.heal(player, pokemon, target, move, () => {
                                    if (callback) callback()
                                })
                                break;
                            case "swagger":
                                battle_application.swagger(player, pokemon, target, move, () => {
                                    if (callback) callback()
                                })
                                break;
                            case "damage+raise":
                            case "damage+lower":
                                battle_application.damage_status(player, pokemon, target, move, () => {
                                    if (callback) callback()
                                })
                                break;
                            case "damage+heal":
                                battle_application.damage_heal(player, pokemon, target, move, () => {
                                    if (callback) callback()
                                })
                                break;
                            case "unique":
                                msg = "[" + player.name + "] Nothing happened!"
                                Vue.set(battle_application.message, player.name==player1.name ? 0: 1, msg)
                                console.log(msg)

                                setTimeout(() => {
                                    if (callback) callback()    
                                }, 1000)
                            break;
                            default:
                                if (callback) callback()
                            break;
                        }
                        
                    }, 1000)
                },
                priority: move.priority + (pokemon.speed/999) - (battle_application.queue.length/999)
            })
        },
        damage_heal: function (player, source, target, move, callback) {
            let moveAccuracy = move.accuracy;
            let moveRNG = Math.floor(Math.random() * (100 - 1 + 1)) + 1

            switch (target.evade_stage) {
                case 1: moveAccuracy *= 0.66; break;
                case 2: moveAccuracy *= 0.5; break;
                case 3: moveAccuracy *= 0.4; break;
                case 4: moveAccuracy *= 0.33; break;
                case 5: moveAccuracy *= 0.28; break;
                case 6: moveAccuracy *= 0.25; break;
                case -1: moveAccuracy *= 1.5;break;
                case -2: moveAccuracy *= 2;break;
                case -3: moveAccuracy *= 2.5;break;
                case -4: moveAccuracy *= 3;break;
                case -5: moveAccuracy *= 3.5;break;
                case -6: moveAccuracy *= 4;break;
            }
            
            if (target.evade_stage > 6) {
                moveAccuracy *= 0.25
            }

            if (target.evade_stage < -6) {
                moveAccuracy *= 4;
            }

            switch (source.accuracy_stage) {
                case 1: moveAccuracy *= 1.5;  break;
                case 2: moveAccuracy *= 2;  break;
                case 3: moveAccuracy *= 2.5;  break;
                case 4: moveAccuracy *= 3;  break;
                case 5: moveAccuracy *= 3.5;  break;
                case 6: moveAccuracy *= 4;  break;
                case -1: moveAccuracy *= 0.66; break;
                case -2: moveAccuracy *= 0.5; break;
                case -3: moveAccuracy *= 0.4; break;
                case -4: moveAccuracy *= 0.33; break;
                case -5: moveAccuracy *= 0.28; break;
                case -6: moveAccuracy *= 0.25; break;
            }
            // Can't have infinite cases.
            if (source.accuracy_stage > 6) {
                moveAccuracy *= 4;
            }

            if (source.accuracy_stage < -6) {
                moveAccuracy *= 0.25;
            }
            
            if (moveRNG > moveAccuracy && moveAccuracy != null) {
                msg = "[" + player.name.toUpperCase() + "] But it missed!"
                Vue.set(battle_application.message, player.id - 1, msg)
                console.log(msg)
                if (callback)
                    callback()
                return
            }

            let damages = battle_application.calculate_dmg(source, target, move)
            let damage = damages[0]
            let mult = 0
            let typeMod = damages[1]
            let critRate = damages[2]

            let mult_rand = []

            if (move.meta.max_hits == 5)
                mult_rand = [2, 2, 2, 3, 3, 3, 4, 5]
            else
                mult_rand = [move.meta.max_hits ? move.meta.max_hits : 1]

            battle_application.animation.pokemon1 = ""
            battle_application.animation.pokemon2 = ""

            if (player.name == player1.name) 
                battle_application.animation.pokemon2 = "animated shake"
            else 
                battle_application.animation.pokemon1 = "animated shake"

            mult = mult_rand[Math.floor(Math.random()*mult_rand.length)]

            let damage_str = mult == 1 ? damage + "" : damage + " x " + mult

            damage *= mult
            
            msg = "[" + player.name.toUpperCase() + "] " +  target.name.toUpperCase() + " received " + damage_str + " damage!"
            Vue.set(battle_application.message, player.id - 1, msg)
            console.log(msg)

            battle_application.updateHP (player.id == 2 ? 1 : 2, -damage, (callback) => {

                let msg_array = [""]
                if (typeMod == 0) {
                    msg_array.push("[" + player.name.toUpperCase() + "] It did not have an effect...")
                } else if (typeMod > 1) {
                    msg_array.push("[" + player.name.toUpperCase() + "] It was super effective!")
                } else if (typeMod < 1) {
                    msg_array.push("[" + player.name.toUpperCase() + "] It wasn't very effective.")
                }
    
                if (critRate > 1) 
                    msg_array.push("[" + player.name.toUpperCase() + "] Critical Hit!")
    
                let msgs = setInterval(() => {
                    let mess = msg_array.pop()
                    if (mess != undefined) {
                        mess != "" ? console.log(mess) : undefined
                        Vue.set(battle_application.message, player.name==player1.name ? 0: 1, mess)
                    }
                    
                    if (msg_array.length == 0) {
                        clearInterval(msgs)
                        
                        let heal = Math.floor(damage/2)
                        target = source
                        
                        heal = (target.max_hp - target.hp) > heal ? heal : (target.max_hp - target.hp)
                        
                        msg = "[" + player.name.toUpperCase() + "] " +  target.name.toUpperCase() + " healed " + heal + " HP!"
                        
                        if (heal == 0)
                            msg = "[" + player.name.toUpperCase() + "] " +  target.name.toUpperCase() + " is already at full health!"
                        Vue.set(battle_application.message, player.id - 1, msg)
                        console.log(msg)

                        battle_application.updateHP (player.id, heal, (next) => {
                            if (next) next()
                        }, callback)
                    }
                }, 1000)
            }, callback)
        },
        heal: function (player, source, target, move, callback) {
            let heal = (target.max_hp/2)
            
            heal = (target.max_hp - target.hp) > heal ? heal : (target.max_hp - target.hp)
            
            msg = "[" + player.name.toUpperCase() + "] " +  target.name.toUpperCase() + " healed " + heal + " HP!"
            
            if (heal == 0)
                msg = "[" + player.name.toUpperCase() + "] " +  target.name.toUpperCase() + " is already at full health!"
            Vue.set(battle_application.message, player.id - 1, msg)
            console.log(msg)

            battle_application.updateHP (player.id, heal, (callback) => {
                if (callback) callback()
            }, callback)
        },
        damage: function (player, source, target, move, callback, onehit) {
            let moveAccuracy = move.accuracy;
            let moveRNG = Math.floor(Math.random() * (100 - 1 + 1)) + 1

            switch (target.evade_stage) {
                case 1: moveAccuracy *= 0.66; break;
                case 2: moveAccuracy *= 0.5; break;
                case 3: moveAccuracy *= 0.4; break;
                case 4: moveAccuracy *= 0.33; break;
                case 5: moveAccuracy *= 0.28; break;
                case 6: moveAccuracy *= 0.25; break;
                case -1: moveAccuracy *= 1.5;break;
                case -2: moveAccuracy *= 2;break;
                case -3: moveAccuracy *= 2.5;break;
                case -4: moveAccuracy *= 3;break;
                case -5: moveAccuracy *= 3.5;break;
                case -6: moveAccuracy *= 4;break;
            }
            
            if (target.evade_stage > 6) {
                moveAccuracy *= 0.25
            }

            if (target.evade_stage < -6) {
                moveAccuracy *= 4;
            }

            switch (source.accuracy_stage) {
                case 1: moveAccuracy *= 1.5;  break;
                case 2: moveAccuracy *= 2;  break;
                case 3: moveAccuracy *= 2.5;  break;
                case 4: moveAccuracy *= 3;  break;
                case 5: moveAccuracy *= 3.5;  break;
                case 6: moveAccuracy *= 4;  break;
                case -1: moveAccuracy *= 0.66; break;
                case -2: moveAccuracy *= 0.5; break;
                case -3: moveAccuracy *= 0.4; break;
                case -4: moveAccuracy *= 0.33; break;
                case -5: moveAccuracy *= 0.28; break;
                case -6: moveAccuracy *= 0.25; break;
            }
            // Can't have infinite cases.
            if (source.accuracy_stage > 6) {
                moveAccuracy *= 4;
            }

            if (source.accuracy_stage < -6) {
                moveAccuracy *= 0.25;
            }
            
            if (moveRNG > moveAccuracy && moveAccuracy != null) {
                msg = "[" + player.name.toUpperCase() + "] But it missed!"
                Vue.set(battle_application.message, player.id - 1, msg)
                console.log(msg)
                if (callback)
                    callback()
                return
            }

            let damages = battle_application.calculate_dmg(source, target, move)

            let damage = (move.name == "seismic-toss") ? 100 : damages[0]
            if (onehit)
                damage = 999

            let mult = 0
            let typeMod = damages[1]
            let critRate = damages[2]

            let mult_rand = []

            if (move.meta.max_hits == 5)
                mult_rand = [2, 2, 2, 3, 3, 3, 4, 5]
            else
                mult_rand = [move.meta.max_hits ? move.meta.max_hits : 1]

            battle_application.animation.pokemon1 = ""
            battle_application.animation.pokemon2 = ""

            if (player.name == player1.name) 
                battle_application.animation.pokemon2 = "animated shake"
            else 
                battle_application.animation.pokemon1 = "animated shake"

            mult = mult_rand[Math.floor(Math.random()*mult_rand.length)]

            let damage_str = mult == 1 ? damage + "" : damage + " x " + mult
            
            msg = "[" + player.name.toUpperCase() + "] " +  target.name.toUpperCase() + " received " + damage_str + " damage!"
            Vue.set(battle_application.message, player.id - 1, msg)
            console.log(msg)

            battle_application.updateHP (player.id == 2 ? 1 : 2, -damage*mult, (callback) => {

                let msg_array = [""]
                if (typeMod == 0) {
                    msg_array.push("[" + player.name.toUpperCase() + "] It did not have an effect...")
                } else if (typeMod > 1) {
                    msg_array.push("[" + player.name.toUpperCase() + "] It was super effective!")
                } else if (typeMod < 1) {
                    msg_array.push("[" + player.name.toUpperCase() + "] It wasn't very effective.")
                }
    
                
    
                if (critRate > 1) 
                    msg_array.push("[" + player.name.toUpperCase() + "] Critical Hit!")
    
                let msgs = setInterval(() => {
                    let mess = msg_array.pop()
                    if (mess != undefined) {
                        mess != "" ? console.log(mess) : undefined
                        Vue.set(battle_application.message, player.name==player1.name ? 0: 1, mess)
                    }
                    
                    if (msg_array.length == 0) {
                        clearInterval(msgs)
                        Vue.set(battle_application.message, player.name==player1.name ? 0: 1, "")
                        if (callback)
                            callback()
                    }
                }, 1000)
            }, callback)
        },
        ailment: function (player, source, target, move, callback) {
            let msg_array = [""]
            let moveAccuracy = move.accuracy;
            let moveRNG = Math.floor(Math.random() * (100 - 1 + 1)) + 1

            switch (target.evade_stage) {
                case 1: moveAccuracy *= 0.66; break;
                case 2: moveAccuracy *= 0.5; break;
                case 3: moveAccuracy *= 0.4; break;
                case 4: moveAccuracy *= 0.33; break;
                case 5: moveAccuracy *= 0.28; break;
                case 6: moveAccuracy *= 0.25; break;
                case -1: moveAccuracy *= 1.5;break;
                case -2: moveAccuracy *= 2;break;
                case -3: moveAccuracy *= 2.5;break;
                case -4: moveAccuracy *= 3;break;
                case -5: moveAccuracy *= 3.5;break;
                case -6: moveAccuracy *= 4;break;
            }
            
            if (target.evade_stage > 6) {
                moveAccuracy *= 0.25
            }

            if (target.evade_stage < -6) {
                moveAccuracy *= 4;
            }

            switch (source.accuracy_stage) {
                case 1: moveAccuracy *= 1.5;  break;
                case 2: moveAccuracy *= 2;  break;
                case 3: moveAccuracy *= 2.5;  break;
                case 4: moveAccuracy *= 3;  break;
                case 5: moveAccuracy *= 3.5;  break;
                case 6: moveAccuracy *= 4;  break;
                case -1: moveAccuracy *= 0.66; break;
                case -2: moveAccuracy *= 0.5; break;
                case -3: moveAccuracy *= 0.4; break;
                case -4: moveAccuracy *= 0.33; break;
                case -5: moveAccuracy *= 0.28; break;
                case -6: moveAccuracy *= 0.25; break;
            }
            
            if (source.accuracy_stage > 6) {
                moveAccuracy *= 4;
            }

            if (source.accuracy_stage < -6) {
                moveAccuracy *= 0.25;
            }

            if (moveRNG > moveAccuracy && moveAccuracy != null) {
                msg = "[" + player.name.toUpperCase() + "] But it missed!"
                Vue.set(battle_application.message, player.id - 1, msg)
                console.log(msg)

                setTimeout(() => {
                    if (callback)
                        callback()
                }, 1000)
                return
            }

            if (target.status.length == 0) {
                battle_application.animation.pokemon1 = ""
                battle_application.animation.pokemon2 = ""
                if (player.name == player1.name) 
                    battle_application.animation.pokemon2 = "animated shake"
                else 
                    battle_application.animation.pokemon1 = "animated shake"
                msg_array.push("[" + player.name.toUpperCase() + "] " + target.name.toUpperCase() +  " was inflicted " + move.meta.ailment.name.toUpperCase())
                target.status.push(move.meta.ailment.name.toUpperCase())
            } 
            
            let msgs = setInterval(() => {
                let mess = msg_array.pop()
                if (mess != undefined) {    
                    mess != "" ? console.log(mess) : undefined
                    Vue.set(battle_application.message, player.name==player1.name ? 0: 1, mess)
                }
                
                if (msg_array.length == 0) {
                    clearInterval(msgs)
                    Vue.set(battle_application.message, player.name==player1.name ? 0: 1, "")
                    
                    if (callback)
                        callback()
                }
            }, 1000)
        },
        status_change: function (player, source, target, move, callback) {
            let msg_array = [""]

            for (i in move.stat_changes) {
                stat_change = move.stat_changes[i]
                target[stat_change.stat.name + "_stage"] += stat_change.change
                msg_array.push("[" + player.name.toUpperCase() + "] " + target.name.toUpperCase() + "'S " + stat_change.stat.name.replace("-", " ").toUpperCase() + (stat_change.change >= 0 ? " rose up!" : " went down!"))
            }

            let msgs = setInterval(() => {
                let mess = msg_array.pop()
                if (mess != undefined) {    
                    mess != "" ? console.log(mess) : undefined
                    Vue.set(battle_application.message, player.name==player1.name ? 0: 1, mess)
                }
                
                if (msg_array.length == 0) {
                    clearInterval(msgs)
                    Vue.set(battle_application.message, player.name==player1.name ? 0: 1, "")
                    
                    if (callback)
                        callback()
                }
            }, 1000)
        },
        swagger: function (player, source, target, move, callback) {
            let moveAccuracy = move.accuracy;
            let moveRNG = Math.floor(Math.random() * (100 - 1 + 1)) + 1

            switch (target.evade_stage) {
                case 1: moveAccuracy *= 0.66; break;
                case 2: moveAccuracy *= 0.5; break;
                case 3: moveAccuracy *= 0.4; break;
                case 4: moveAccuracy *= 0.33; break;
                case 5: moveAccuracy *= 0.28; break;
                case 6: moveAccuracy *= 0.25; break;
                case -1: moveAccuracy *= 1.5;break;
                case -2: moveAccuracy *= 2;break;
                case -3: moveAccuracy *= 2.5;break;
                case -4: moveAccuracy *= 3;break;
                case -5: moveAccuracy *= 3.5;break;
                case -6: moveAccuracy *= 4;break;
            }
            
            if (target.evade_stage > 6) {
                moveAccuracy *= 0.25
            }

            if (target.evade_stage < -6) {
                moveAccuracy *= 4;
            }

            switch (source.accuracy_stage) {
                case 1: moveAccuracy *= 1.5;  break;
                case 2: moveAccuracy *= 2;  break;
                case 3: moveAccuracy *= 2.5;  break;
                case 4: moveAccuracy *= 3;  break;
                case 5: moveAccuracy *= 3.5;  break;
                case 6: moveAccuracy *= 4;  break;
                case -1: moveAccuracy *= 0.66; break;
                case -2: moveAccuracy *= 0.5; break;
                case -3: moveAccuracy *= 0.4; break;
                case -4: moveAccuracy *= 0.33; break;
                case -5: moveAccuracy *= 0.28; break;
                case -6: moveAccuracy *= 0.25; break;
            }
            // Can't have infinite cases.
            if (source.accuracy_stage > 6) {
                moveAccuracy *= 4;
            }

            if (source.accuracy_stage < -6) {
                moveAccuracy *= 0.25;
            }
            
            if (moveRNG > moveAccuracy && moveAccuracy != null) {
                msg = "[" + player.name.toUpperCase() + "] But it missed!"
                Vue.set(battle_application.message, player.id - 1, msg)
                console.log(msg)
                if (callback)
                    callback()
                return
            }
            
            let msg_array = [""]

            for (i in move.stat_changes) {
                stat_change = move.stat_changes[i]
                target[stat_change.stat.name + "_stage"] += stat_change.change
                msg_array.push("[" + player.name.toUpperCase() + "] " + target.name.toUpperCase() + "'S " + stat_change.stat.name.replace("-", " ").toUpperCase() + (stat_change.change >= 0 ? " rose up!" : " went down!"))
            }

            if (move.meta.ailment.name.toUpperCase() == "CONFUSION" || target.status.length == 0) {
        
                battle_application.animation.pokemon1 = ""
                battle_application.animation.pokemon2 = ""
                if (player.name == player1.name) 
                    battle_application.animation.pokemon2 = "animated shake"
                else 
                    battle_application.animation.pokemon1 = "animated shake"
                msg_array.push("[" + player.name.toUpperCase() + "] " + target.name.toUpperCase() +  " was inflicted " + move.meta.ailment.name.toUpperCase())
                target.status.push(move.meta.ailment.name.toUpperCase())
            } 

            if (target.status.length == 1 && move.meta.ailment.name.toUpperCase() != "CONFUSION" && (target.status[0] == "CONFUSION" || target.status[0] == "TRAP")) {
                
                battle_application.animation.pokemon1 = ""
                battle_application.animation.pokemon2 = ""
                if (player.name == player1.name) 
                    battle_application.animation.pokemon2 = "animated shake"
                else 
                    battle_application.animation.pokemon1 = "animated shake"

                msg_array.push("[" + player.name.toUpperCase() + "] " + target.name.toUpperCase() +  " was inflicted " + move.meta.ailment.name.toUpperCase())
                target.status.push(move.meta.ailment.name.toUpperCase())   
            }
            let msgs = setInterval(() => {
                let mess = msg_array.pop()
                if (mess != undefined) {
                    mess != "" ? console.log(mess) : undefined
                    Vue.set(battle_application.message, player.name==player1.name ? 0: 1, mess)
                }
                
                if (msg_array.length == 0) {
                    clearInterval(msgs)
                    Vue.set(battle_application.message, player.name==player1.name ? 0: 1, "")
                    if (callback)
                        callback()
                }
            }, 1000)
        },
        damage_status: function (player, source, target, move, callback) {
            let moveAccuracy = move.accuracy;
            let moveRNG = Math.floor(Math.random() * (100 - 1 + 1)) + 1

            switch (target.evade_stage) {
                case 1: moveAccuracy *= 0.66; break;
                case 2: moveAccuracy *= 0.5; break;
                case 3: moveAccuracy *= 0.4; break;
                case 4: moveAccuracy *= 0.33; break;
                case 5: moveAccuracy *= 0.28; break;
                case 6: moveAccuracy *= 0.25; break;
                case -1: moveAccuracy *= 1.5;break;
                case -2: moveAccuracy *= 2;break;
                case -3: moveAccuracy *= 2.5;break;
                case -4: moveAccuracy *= 3;break;
                case -5: moveAccuracy *= 3.5;break;
                case -6: moveAccuracy *= 4;break;
            }
            
            if (target.evade_stage > 6) {
                moveAccuracy *= 0.25
            }

            if (target.evade_stage < -6) {
                moveAccuracy *= 4;
            }

            switch (source.accuracy_stage) {
                case 1: moveAccuracy *= 1.5;  break;
                case 2: moveAccuracy *= 2;  break;
                case 3: moveAccuracy *= 2.5;  break;
                case 4: moveAccuracy *= 3;  break;
                case 5: moveAccuracy *= 3.5;  break;
                case 6: moveAccuracy *= 4;  break;
                case -1: moveAccuracy *= 0.66; break;
                case -2: moveAccuracy *= 0.5; break;
                case -3: moveAccuracy *= 0.4; break;
                case -4: moveAccuracy *= 0.33; break;
                case -5: moveAccuracy *= 0.28; break;
                case -6: moveAccuracy *= 0.25; break;
            }
            // Can't have infinite cases.
            if (source.accuracy_stage > 6) {
                moveAccuracy *= 4;
            }

            if (source.accuracy_stage < -6) {
                moveAccuracy *= 0.25;
            }
            
            if (moveRNG > moveAccuracy && moveAccuracy != null) {
                msg = "[" + player.name.toUpperCase() + "] But it missed!"
                Vue.set(battle_application.message, player.id - 1, msg)
                console.log(msg)
                if (callback)
                    callback()
                return
            }

            let damages = battle_application.calculate_dmg(source, target, move)
            let damage = damages[0]
            let typeMod = damages[1]
            let critRate = damages[2]

            battle_application.animation.pokemon1 = ""
            battle_application.animation.pokemon2 = ""
            if (player.name == player1.name) 
                battle_application.animation.pokemon2 = "animated shake"
            else 
                battle_application.animation.pokemon1 = "animated shake"
            
            msg = "[" + player.name.toUpperCase() + "] " +  target.name.toUpperCase() + " received " + damage + " damage!"
            Vue.set(battle_application.message, player.id - 1, msg)
            console.log(msg)

            battle_application.updateHP (player.id == 2 ? 1 : 2, -damage, (callback) => {
                let msg_array = [""]
                
                for (i in move.stat_changes) {
                    stat_change = move.stat_changes[i]
                    target[stat_change.stat.name + "_stage"] += stat_change.change
                    msg_array.push("[" + player.name.toUpperCase() + "] " + target.name.toUpperCase() + "'S " + stat_change.stat.name.replace("-", " ").toUpperCase() + (stat_change.change >= 0 ? " rose up!" : " went down!"))
                }

                if (typeMod == 0) {
                    msg_array.push("[" + player.name.toUpperCase() + "] It did not have an effect...")
                } else if (typeMod > 1) {
                    msg_array.push("[" + player.name.toUpperCase() + "] It was super effective!")
                } else if (typeMod < 1) {
                    msg_array.push("[" + player.name.toUpperCase() + "] It wasn't very effective.")
                }
    
                
    
                if (critRate > 1) 
                    msg_array.push("[" + player.name.toUpperCase() + "] Critical Hit!")
    
                let msgs = setInterval(() => {
                    let mess = msg_array.pop()
                    if (mess != undefined) {
                        mess != "" ? console.log(mess) : undefined
                        Vue.set(battle_application.message, player.name==player1.name ? 0: 1, mess)
                    }
                    
                    if (msg_array.length == 0) {
                        clearInterval(msgs)
                        Vue.set(battle_application.message, player.name==player1.name ? 0: 1, "")
                        if (callback)
                            callback()
                    }
                }, 1000)
            }, callback)
        },
        damage_ailment: function (player, source, target, move, callback) {
            let moveAccuracy = move.accuracy;
            let moveRNG = Math.floor(Math.random() * (100 - 1 + 1)) + 1

            switch (target.evade_stage) {
                case 1: moveAccuracy *= 0.66; break;
                case 2: moveAccuracy *= 0.5; break;
                case 3: moveAccuracy *= 0.4; break;
                case 4: moveAccuracy *= 0.33; break;
                case 5: moveAccuracy *= 0.28; break;
                case 6: moveAccuracy *= 0.25; break;
                case -1: moveAccuracy *= 1.5;break;
                case -2: moveAccuracy *= 2;break;
                case -3: moveAccuracy *= 2.5;break;
                case -4: moveAccuracy *= 3;break;
                case -5: moveAccuracy *= 3.5;break;
                case -6: moveAccuracy *= 4;break;
            }
            
            if (target.evade_stage > 6) {
                moveAccuracy *= 0.25
            }

            if (target.evade_stage < -6) {
                moveAccuracy *= 4;
            }

            switch (source.accuracy_stage) {
                case 1: moveAccuracy *= 1.5;  break;
                case 2: moveAccuracy *= 2;  break;
                case 3: moveAccuracy *= 2.5;  break;
                case 4: moveAccuracy *= 3;  break;
                case 5: moveAccuracy *= 3.5;  break;
                case 6: moveAccuracy *= 4;  break;
                case -1: moveAccuracy *= 0.66; break;
                case -2: moveAccuracy *= 0.5; break;
                case -3: moveAccuracy *= 0.4; break;
                case -4: moveAccuracy *= 0.33; break;
                case -5: moveAccuracy *= 0.28; break;
                case -6: moveAccuracy *= 0.25; break;
            }
            // Can't have infinite cases.
            if (source.accuracy_stage > 6) {
                moveAccuracy *= 4;
            }

            if (source.accuracy_stage < -6) {
                moveAccuracy *= 0.25;
            }
            
            if (moveRNG > moveAccuracy && moveAccuracy != null) {
                msg = "[" + player.name.toUpperCase() + "] But it missed!"
                Vue.set(battle_application.message, player.id - 1, msg)
                console.log(msg)
                if (callback)
                    callback()
                return
            }

            let damages = battle_application.calculate_dmg(source, target, move)
            let damage = damages[0]
            let typeMod = damages[1]
            let critRate = damages[2]

            battle_application.animation.pokemon1 = ""
            battle_application.animation.pokemon2 = ""
            if (player.name == player1.name) 
                battle_application.animation.pokemon2 = "animated shake"
            else 
                battle_application.animation.pokemon1 = "animated shake"
            
            msg = "[" + player.name.toUpperCase() + "] " +  target.name.toUpperCase() + " received " + damage + " damage!"
            Vue.set(battle_application.message, player.id - 1, msg)
            console.log(msg)

            battle_application.updateHP (player.id == 2 ? 1 : 2, -damage, (callback) => {
                let ailmentChance = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
                let msg_array = [""]
                if (move.meta.ailment_chance > ailmentChance) {
                    if (move.meta.ailment.name.toUpperCase() == "CONFUSION" || target.status.length == 0) {
                    
                        battle_application.animation.pokemon1 = ""
                        battle_application.animation.pokemon2 = ""
                        if (player.name == player1.name) 
                            battle_application.animation.pokemon2 = "animated shake"
                        else 
                            battle_application.animation.pokemon1 = "animated shake"
                        msg_array.push("[" + player.name.toUpperCase() + "] " + target.name.toUpperCase() +  " was inflicted " + move.meta.ailment.name.toUpperCase())
                        target.status.push(move.meta.ailment.name.toUpperCase())
                    } 
        
                    if (target.status.length == 1 && move.meta.ailment.name.toUpperCase() != "CONFUSION" && target.status[0] == "CONFUSION") {
                        
                        battle_application.animation.pokemon1 = ""
                        battle_application.animation.pokemon2 = ""
                        if (player.name == player1.name) 
                            battle_application.animation.pokemon2 = "animated shake"
                        else 
                            battle_application.animation.pokemon1 = "animated shake"
        
                        msg_array.push("[" + player.name.toUpperCase() + "] " + target.name.toUpperCase() +  " was inflicted " + move.meta.ailment.name.toUpperCase())
                        target.status.push(move.meta.ailment.name.toUpperCase())   
                    }
                }

                if (typeMod == 0) {
                    msg_array.push("[" + player.name.toUpperCase() + "] It did not have an effect...")
                } else if (typeMod > 1) {
                    msg_array.push("[" + player.name.toUpperCase() + "] It was super effective!")
                } else if (typeMod < 1) {
                    msg_array.push("[" + player.name.toUpperCase() + "] It wasn't very effective.")
                }        
    
                if (critRate > 1) 
                    msg_array.push("[" + player.name.toUpperCase() + "] Critical Hit!")
                
                let msgs = setInterval(() => {
                    let mess = msg_array.pop()
                    if (mess != undefined) {
                        mess != "" ? console.log(mess) : undefined
                        Vue.set(battle_application.message, player.name==player1.name ? 0: 1, mess)
                    }
                    
                    if (msg_array.length == 0) {
                        clearInterval(msgs)
                        Vue.set(battle_application.message, player.name==player1.name ? 0: 1, "")
                        if (callback)
                            callback()
                    }
                }, 1000)
                
            }, callback)
        },
        calculate_dmg: function (pokemon, enemy, move) {
            let random = random85()
            let stab = (pokemon.type[0].type.name == move.type.name || (pokemon.type.length == 2 ? pokemon.type[1].name : "") == move.type.name) ? 1.5 : 1.0
            let type = calculateType(move.type.name, enemy.type[0].type.name, enemy.type.length == 2 ? enemy.type[1].type.name : "")
            let burn = (pokemon.status.indexOf("BURN") != -1) ? 0.5 : 1
            let critRate = calculateCrit(move.meta.crit_rate)
            let modifier = random * stab * type * burn * critRate

            let A = move.damage_class.name == "special" ? pokemon["special-attack"] : pokemon["attack"]
            let D = move.damage_class.name == "special" ? enemy["special-defense"] : pokemon["defense"]
            return [Math.floor((((2*level/5 + 2) * move.power * A / D)/50 + 2) * modifier), type, critRate]
        },
        fight: function (player, pokemon, previous, prevKeys) {
            let moves = pokemon.moves

            let act = []
            let act_key = []

            for (let i in moves) {
                let move = moves[i]
                
                let move_name = move.name.toUpperCase().replace("-", " ")

                act_key.push(   
                    "<div class = 'leading-none mx-2 w-full flex flex-col text-left align-center justify-center'>" + 
                        "<div class = 'flex flex-row text-sm align-center leading-none'>" +
                            "<div class = 'mr-2 px-2 h-3 rounded-sm " + battle_application.type_data[move.type.name].color + "'>" + move.type.name.toUpperCase() + "</div>"
                            + move_name + 
                        "</div>" +
                        "<div class = 'flex flex-row text-sm align-center leading-none'>" +
                            "<div class = 'text-sm w-20'> <b> PP </b> </div>" +
                            "<div class = 'text-sm w-10'>" + move.pp + "/" + move.max_pp+ "</div>" +
                        "</div>" +
                        "<div class = 'flex flex-row text-sm align-center leading-none'>" +
                            "<div class = 'text-sm w-20'> <b> ACCURACY </b> </div>" +
                            "<div class = 'text-sm w-10'>" + (move.accuracy ? move.accuracy : "-") + "</div>" +
                        "</div>" +
                        "<div class = 'flex flex-row text-sm align-center leading-none'>" +
                            "<div class = 'text-sm w-20'> <b> POWER </b> </div>" +
                            "<div class = 'text-sm w-10'>" + (move.power ? move.power : "-") + "</div>" +
                        "</div>" +
                    "</div>"
                )
                act.push(() => {
                    let confused = true
                    // let confused = Math.ceil(Math.random() * 2) == 2
                    let msg_array = []

                    if (pokemon.status.indexOf("CONFUSION") != -1 && confused) {
                        msg_array.push("[" + player.name.toUpperCase() + "] " + pokemon.name.toUpperCase() + " hurt itself in the confusion!")
                    }

                    if (pokemon.status.indexOf("CONFUSION") != -1) {
                        msg_array.push("[" + player.name.toUpperCase() + "] " + pokemon.name.toUpperCase() + " is confused!")
                    }
              
                    let msgs = setInterval(() => {
                        let mess = msg_array.pop()
                        if (mess != undefined) {
                            mess != "" ? console.log(mess) : undefined
                            Vue.set(battle_application.message, player.name==player1.name ? 0: 1, mess)
                        }
                        
                        if (msg_array.length == 0) {
                            clearInterval(msgs)
                            Vue.set(battle_application.message, player.name==player1.name ? 0: 1, "")
                            if (pokemon.status.indexOf("CONFUSION") != -1 && confused) {
                                
                                battle_application.updateHP(player, -Math.round(pokemon.max_hp/8), (next) => {
                                    if (next) next()
                                }, () => { Vue.set(battle_application.message, player-1, "") })

                                return
                            }
                            battle_application.choose_move(player, pokemon, i)
                        }
                    }, 1000)
                    
                    Vue.set(battle_application.actions, player.name == battle_application.player1.name ? 0 : 1, [])
                    Vue.set(battle_application.action_keys, player.name == battle_application.player1.name ? 0 : 1, [])
                })
            }
            
            act_key.push("BACK")
            act.push(function () {
                Vue.set(battle_application.actions, battle_application.player1.name == player.name ? 0 : 1, previous)
                Vue.set(battle_application.action_keys, battle_application.player1.name == player.name ? 0 : 1, prevKeys)
            })

            Vue.set(this.actions, player.name == this.player1.name ? 0 : 1, act)
            Vue.set(this.action_keys, player.name == this.player1.name ? 0 : 1, act_key)

            if (player.cpu) {
                let run = this.actions[player.id-1][player.think_move(
                    player.id == 1 ? player1.pokemons[0] : player2.pokemons[0],
                    player.id == 1 ? player2.pokemons[0] : player1.pokemons[0])]
                if (run) run()
            }
        },
        exit: function () {
            if (confirm("Are you sure you want to end this battle?")) {
                transition("#battle", "#start")
            }
        },
        win_close: function (player) {
            this.animation = {
                "pokemon1": "",
                "pokemon2": ""
            }
            alert(player.name.toUpperCase() + " wins the battle!");
            console.log(player.name.toUpperCase() + " wins the battle!")
            transition("#battle", "#start")
        },
        switch: function (player, previous, prevKeys, forced) {
            let act = []
            let act_key = []

            for (let i = 1; i < player.pokemons.length; i++) {
                let battle_application = this
                if (player.pokemons[i].hp != 0) {
                    act.push(function () { 
                        if (!forced) {
                            msg = ("Waiting for " + ((player.name == player1.name) ? player2.name : player1.name).toUpperCase())
                            Vue.set(battle_application.message, (player.name == player1.name) ? 0 : 1, msg)
                            
                            battle_application.queue.push({
                                execute (next) {
                                    battle_application.swap(i, (player.name == player1.name) ? 1 : 2, () => {
                                        Vue.set(battle_application.actions, player.name == battle_application.player1.name ? 0 : 1, [])
                                        Vue.set(battle_application.action_keys, player.name == battle_application.player1.name ? 0 : 1, [])
                                        
                                        if (next) 
                                            next()     
                                    }, false); 
                                },
                                priority: 0 + (player.pokemons[i].speed/999) - (battle_application.queue.length/999)
                            })
                        } else {
                            battle_application.swap(i, (player.name == player1.name) ? 1 : 2, () => {
                                battle_application.endTurn()
                            }, true); 
                        }
                    })
                    
                    act_key.push(
                        "<img class = 'w-10 mx-auto text-center' src='" + player.pokemons[i].sprites.front_default + "'/>" + 
                        "<div class = 'text-sm'>" 
                            +  player.pokemons[i].hp  + "/" 
                            + player.pokemons[i].max_hp + 
                        "</div>" +
                        "<div class = 'flex flex-center justify-center flex-col'>" + 
                            "<div class = 'm-1 px-3 px-0 text-sm h-3 rounded-full leading-none " 
                                + battle_application.type_data[player.pokemons[i].type[0].type.name].color + "'>" 
                                + player.pokemons[i].type[0].type.name.toUpperCase() + 
                            "</div>" 
                            + ( player.pokemons[i].type.length == 2 ? 
                            "<div class = 'm-1 px-3 px-0 text-sm h-3 rounded-full leading-none " 
                                + battle_application.type_data[player.pokemons[i].type[1].type.name].color + "'>" 
                                + player.pokemons[i].type[1].type.name.toUpperCase() + 
                            "</div>":
                            "") + 
                        "</div>"
                    )    
                }
            }

            if (!forced) {
                act_key.push("BACK")
                act.push(function () {
                    Vue.set(battle_application.actions, battle_application.player1.name == player.name ? 0 : 1, previous)
                    Vue.set(battle_application.action_keys, battle_application.player1.name == player.name ? 0 : 1, prevKeys)
                })
            }

            Vue.set(this.actions, player.name == this.player1.name ? 0 : 1, act)
            Vue.set(this.action_keys, player.name == this.player1.name ? 0 : 1, act_key)

            let pkmn = (player.id == 1 ? player1.pokemons[0] : player2.pokemons[0])
            if (player.cpu) {
                let run = this.actions[player.id-1][player.think_switch(
                        player.id == 1 ? player1.pokemons[0] : player2.pokemons[0], 
                        player.id == 1 ? player2.pokemons[0] : player1.pokemons[0],
                        player1.pokemons)]

                if (run) run()
            }
        },
        blank: function () { 

        },
        set_main_menu: function (player) {
            let battle_application = this
            let player_object = player == 1 ? this.player1 : this.player2
            this.action_keys[player-1] = ["FIGHT", "SWITCH"]
            this.actions[player-1] = [
                function () {
                    battle_application.fight(player_object, player_object.pokemons[0], battle_application.actions[player_object.id-1], battle_application.action_keys[player_object.id-1])
                },
                function () {
                    battle_application.switch(player_object, battle_application.actions[player_object.id-1], battle_application.action_keys[player_object.id-1], false)
                }
            ]

            if (player_object.cpu) 
                setTimeout( () => {
                    let run = battle_application.actions[player_object.id-1][player_object.think_menu(player_object, player == 1 ? this.player2 : this.player1)]
                    if (run) run()
                }, 1000)
        },
        start: function (player1, player2) {
            this.player1 = player1
            this.player2 = player2
            
            this.set_main_menu(1)
            this.set_main_menu(2)

            this.animation = {
                "pokemon1": "",
                "pokemon2": ""
            }

            battleOngoing = true
        },
        swap: function(index, player, callback, forced) {
            let player_object = player == 1 ? this.player1 : this.player2

            let run = () => { 
                let temp = player_object.pokemons[0]
                player_object.pokemons[0] = player_object.pokemons[index]
                player_object.pokemons[index] = temp
                
                this.animation["pokemon"+player_object.id] = "animated rotateIn"

                msg = "Go " + player_object.pokemons[0].name.toUpperCase() + "! I choose you!"
                Vue.set(this.message, player-1, msg)
                console.log("[" + player_object.name.toUpperCase() + "]: " + msg)
                setTimeout(() => { 
                    Vue.set(this.message, player-1, null) 
                    if (callback) {
                        callback()
                    }
                }, 1000)
            }

            if (forced) {
                run()
                return
            } 

            msg = "Come back " + player_object.pokemons[0].name.toUpperCase() + "!"
            Vue.set(this.message, player_object.id-1, msg)
            console.log("[" + player_object.name.toUpperCase() + "]: " + msg)
            
            this.animation["pokemon"+player_object.id] = "animated rotateOut"
            
            setTimeout(() => { 
                run()
                setTimeout(() => { }, 1000)
            }, 1000) 
        }
    }
})

let queue = setInterval(() => {
    if (battle_application.queue.length == 2) {
        battle_application.queue.sort((a, b) => {
            let comp = 0
            if (a.priority > b.priority)
                comp = 1
            if (a.priority < b.priority)
                comp = -1
            return comp
        })

        let max_prio = battle_application.queue[1].priority
        let min_prio = battle_application.queue[0].priority

        let actions = battle_application.queue.splice(0,2)
        if (max_prio > min_prio) {
            actions[1].execute(() => {
                actions[0].execute(battle_application.endTurn)
            })
        } else {
            actions[0].execute(() => {
                actions[1].execute(battle_application.endTurn)
            })
        }
    }
}, 1)

let whoWon = setInterval(() => {
    if (battleOngoing) {
        let pkmn1Dead = true
        let pkmn2Dead = true
    
        for (let i in battle_application.player1.pokemons) {
            let pokemon = battle_application.player1.pokemons[i]
            if (pokemon.hp != 0) {
                pkmn1Dead = false
            }
        }
    
        for (let i in battle_application.player2.pokemons) {
            let pokemon = battle_application.player2.pokemons[i]
            if (pokemon.hp != 0) {
                pkmn2Dead = false
            }
        }
    
        if (pkmn1Dead) {
            battle_application.win_close(player2)
            battleOngoing = false
        }

        if (pkmn2Dead) {
            battle_application.win_close(player1)
            battleOngoing = false
        }
    }
}, 1)