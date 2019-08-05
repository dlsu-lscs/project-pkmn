var calculateCrit = function (critChance)
{
    if (critChance == 0)
        critChance = Math.floor(Math.random() * (16 - 1 + 1)) + 1;
    
    if (critChance == 1) {
        critModifier = ((2 * 50 + 5) / (50 + 5));
    } else {
        critModifier = 1;
    }

    return critModifier
}

var calculateType = function (moveType, enemyType1, enemyType2)
{
    // Resetting the typeModifier back to 1, just in case it isn't already.
    typeModifier = 1;

    /**
     * If statements start here, they change the typeModifier depending on the move type.
     * Example:
     * if (moveType == (name of type)
     * {
     *     switch (enemyType1)
     *     {
     *          case "name of type":
     *              typeModifier = typeModifier * (double that changes the modifier);
     *              break;
     *     }
     *     switch (enemyType2)
     *     {
     *          case "name of type":
     *              typeModifier = typeModifier * (double that changes the modifier);
     *              break;
     *     }
     * }
     */
    if (moveType == "normal")
    {
        switch (enemyType1)
        {
            case "rock":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "ghost":
                typeModifier = typeModifier * 0;
                break;
        }
        switch (enemyType2)
        {
            case "rock":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "ghost":
                typeModifier = typeModifier * 0;
                break;
        }
    }
    if (moveType == "fire")
    {
        switch (enemyType1)
        {
            case "fire":
            case "water":
            case "rock":
            case "dragon":
                typeModifier = typeModifier * 0.5;
                break;
            case "grass":
            case "ice":
            case "bug":
            case "steel":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "fire":
            case "water":
            case "rock":
            case " dragon":
                typeModifier = typeModifier * 0.5;
                break;
            case "grass":
            case "ice":
            case "bug":
            case "steel":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "water")
    {
        switch (enemyType1)
        {
            case "water":
            case "grass":
            case "dragon":
                typeModifier = typeModifier * 0.5;
                break;
            case "fire":
            case "ground":
            case "rock":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "water":
            case "grass":
            case "dragon":
                typeModifier = typeModifier * 0.5;
                break;
            case "fire":
            case "ground":
            case "rock":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "electric")
    {
        switch (enemyType1)
        {
            case "electric":
            case "grass":
            case "ground":
            case "dragon":
                typeModifier = typeModifier * 0.5;
                break;
            case "ground":
                typeModifier = typeModifier * 0;
                break;
            case "water":
            case "flying":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "electric":
            case "grass":
            case "ground":
            case "dragon":
                typeModifier = typeModifier * 0.5;
                break;
            case "ground":
                typeModifier = typeModifier * 0;
                break;
            case "water":
            case "flying":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "grass")
    {
        switch (enemyType1)
        {
            case "fire":
            case "grass":
            case "poison":
            case "flying":
            case "bug":
            case "dragon":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "water":
            case "ground":
            case "rock":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "fire":
            case "grass":
            case "poison":
            case "flying":
            case "bug":
            case "dragon":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "water":
            case "ground":
            case "rock":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "ice")
    {
        switch (enemyType1)
        {
            case "fire":
            case "water":
            case "ice":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "grass":
            case "ground":
            case "flying":
            case "dragon":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "fire":
            case "water":
            case "ice":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "grass":
            case "ground":
            case "flying":
            case "dragon":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "fighting")
    {
        switch (enemyType1)
        {
            case "poison":
            case "flying":
            case "psychic":
            case "bug":
            case "fairy":
                typeModifier = typeModifier * 0.5;
                break;
            case "ghost":
                typeModifier = typeModifier * 0;
                break;
            case "normal":
            case "ice":
            case "rock":
            case "dark":
            case "steel":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "poison":
            case "flying":
            case "psychic":
            case "bug":
            case "fairy":
                typeModifier = typeModifier * 0.5;
                break;
            case "ghost":
                typeModifier = typeModifier * 0;
                break;
            case "normal":
            case "ice":
            case "rock":
            case "dark":
            case "steel":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "poison")
    {
        switch (enemyType1)
        {
            case "poison":
            case "ground":
            case "rock":
            case "ghost":
                typeModifier = typeModifier * 0.5;
                break;
            case "steel":
                typeModifier = typeModifier * 0;
                break;
            case "grass":
            case "fairy":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "poison":
            case "ground":
            case "rock":
            case "ghost":
                typeModifier = typeModifier * 0.5;
                break;
            case "steel":
                typeModifier = typeModifier * 0;
                break;
            case "grass":
            case "fairy":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "ground")
    {
        switch (enemyType1)
        {
            case "grass":
            case "bug":
                typeModifier = typeModifier * 0.5;
                break;
            case "flying":
                typeModifier = typeModifier * 0;
                break;
            case "fire":
            case "electric":
            case "poison":
            case "rock":
            case "steel":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "grass":
            case "bug":
                typeModifier = typeModifier * 0.5;
                break;
            case "flying":
                typeModifier = typeModifier * 0;
                break;
            case "fire":
            case "electric":
            case "poison":
            case "rock":
            case "steel":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "flying")
    {
        switch (enemyType1)
        {
            case "electric":
            case "rock":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "grass":
            case "fighting":
            case "bug":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "electric":
            case "rock":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "grass":
            case "fighting":
            case "bug":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "psychic")
    {
        switch (enemyType1)
        {
            case "psychic":
            case "dark":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "dark":
                typeModifier = typeModifier * 0;
                break;
            case "fighting":
            case "poison":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "psychic":
            case "dark":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "dark":
                typeModifier = typeModifier * 0;
                break;
            case "fighting":
            case "poison":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "bug")
    {
        switch (enemyType1)
        {
            case "fire":
            case "fighting":
            case "poison":
            case "flying":
            case "ghost":
            case "steel":
            case "fairy":
                typeModifier = typeModifier * 0.5;
                break;
            case "grass":
            case "psychic":
            case "dark":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "fire":
            case "fighting":
            case "poison":
            case "flying":
            case "ghost":
            case "steel":
            case "fairy":
                typeModifier = typeModifier * 0.5;
                break;
            case "grass":
            case "psychic":
            case "dark":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "rock")
    {
        switch (enemyType1)
        {
            case "fighting":
            case "ground":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "fire":
            case "ice":
            case "flying":
            case "bug":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "fighting":
            case "ground":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "fire":
            case "ice":
            case "flying":
            case "bug":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "ghost")
    {
        switch (enemyType1)
        {
            case "normal":
                typeModifier = typeModifier * 0;
                break;
            case "dark":
                typeModifier = typeModifier * 0.5;
                break;
            case "psychic":
            case "ghost":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "normal":
                typeModifier = typeModifier * 0;
                break;
            case "dark":
                typeModifier = typeModifier * 0.5;
                break;
            case "psychic":
            case "ghost":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "dragon")
    {
        switch (enemyType1)
        {
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "fairy":
                typeModifier = typeModifier * 0;
                break;
            case "dragon":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "fairy":
                typeModifier = typeModifier * 0;
                break;
            case "dragon":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "dark")
    {
        switch (enemyType1)
        {
            case "fighting":
            case "dark":
            case "fairy":
                typeModifier = typeModifier * 0.5;
                break;
            case "psychic":
            case "ghost":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "fighting":
            case "dark":
            case "fairy":
                typeModifier = typeModifier * 0.5;
                break;
            case "psychic":
            case "ghost":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "steel")
    {
        switch (enemyType1)
        {
            case "fire":
            case "water":
            case "electric":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "ice":
            case "rock":
            case "fairy":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "fire":
            case "water":
            case "electric":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "ice":
            case "rock":
            case "fairy":
                typeModifier = typeModifier * 2;
                break;
        }
    }
    if (moveType == "fairy")
    {
        switch (enemyType1)
        {
            case "fire":
            case "poison":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "fighting":
            case "dragon":
            case "dark":
                typeModifier = typeModifier * 2;
                break;
        }
        switch (enemyType2)
        {
            case "fire":
            case "poison":
            case "steel":
                typeModifier = typeModifier * 0.5;
                break;
            case "fighting":
            case "dragon":
            case "dark":
                typeModifier = typeModifier * 2;
                break;
        }
    }

    return typeModifier
}

function random85 () {
    return Math.random() * 0.15 + 0.85
}