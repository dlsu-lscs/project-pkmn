function transition (start, end) {
    $(start).fadeOut(() => {
        $(end).fadeIn();
    })
}

$(".battle").click(async (e) => {
    let target = e.currentTarget
    let type = $(target).attr("id")

    let done = true

    if (typeof player1 == "undefined") {
        alert("Load player1.js into the correct designation.")
        done = false
    }
    
    if (typeof player1 == "undefined" || typeof player2 == "undefined") {
        alert("Load player1.js and player2.js first into the correct designation.")
        done = false
    }

    if (done) {
        player1 = load_player1()
        player2 = load_player2()
        player1 = await load_data(player1)
        player2 = await load_data(player2)
        player1.cpu = false
        player2.cpu = false
        switch (type) {
            case "human-human": break;
            case "human-computer": player2.cpu = true; break;
            case "computer-computer": player1.cpu = true; player2.cpu = true; break;
        }
        
        battle_application.start(player1, player2)
        transition("#start", "#battle")
    }
    
})

$("#modify-computer").click((e) => {
        
})

