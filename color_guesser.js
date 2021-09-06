// initiailize constants
const OUTER_MARGIN = 50
const INNER_MARGIN = 25
const SIZE = 100
const A = OUTER_MARGIN
const B = OUTER_MARGIN + SIZE + INNER_MARGIN
const C = OUTER_MARGIN + 2*SIZE + 2*INNER_MARGIN
const GUESSABLE_SQUARES = [[A,A], [B,A], [C,A], [A,B], [C,B], [A,C], [B,C], [C,C]] // skip center (B,B) square

// generate svg board
var svg = d3.select('#vis')
    .attr('width', 600)
    .attr('height', 600)

// generate guessable square based on location and color
function createGuessableSquare(x,y,red,green,blue,true_color_array,score) {
    svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', SIZE)
        .attr('height', SIZE)
        .attr('stroke', 'white')
        .attr('fill', `rgb(${red}, ${green}, ${blue})`)
        .on('mouseover', function() {
            d3.select(this)
                .attr('x', x - 3)
                .attr('y', y - 3)
                .attr('width', SIZE + 6)
                .attr('height', SIZE + 6)
        })
        .on('mouseout', function() {
            d3.select(this)
                .attr('x', x)
                .attr('y', y)
                .attr('width', SIZE)
                .attr('height', SIZE)
        })
        .on('click', function() {
            validateChoice(this.getAttribute("fill"),true_color_array,score)
        })
    return
  }

// generate main square based color
function createMainSquare(red,green,blue) {
    svg.append('rect')
        .attr('x', B)
        .attr('y', B)
        .attr('width', SIZE)
        .attr('height', SIZE)
        .attr('stroke', 'white')
        .attr('fill', `rgb(${red}, ${green}, ${blue})`)
    return
  }

// generate timer square based on color
function createTimer(red,green,blue,isFake) {
    
    timer_size = 6

    if (isFake) {
        time_total = 0 // set time to zero so timer does not run

    }
    else {
        time_total = 5000 // duration in milliseconds
        resetTimeout = setTimeout(function() {openMenu(score, [red,green,blue])}, time_total);
    }
    
    svg.append('rect') // border
        .attr('x', B - timer_size)
        .attr('y', B - timer_size)
        .attr('width', SIZE + (2*timer_size))
        .attr('height', SIZE + (2*timer_size))
        .attr('stroke', 'gray')
        .attr('fill', `white`)

    svg.append('rect') // top left
        .attr('x', B)
        .attr('y', B -timer_size)
        .attr('width', (SIZE/2))
        .attr('height', timer_size)
        .attr('fill', `rgb(${red}, ${green}, ${blue})`)
        .transition()
            .ease(d3.easeLinear)
            .duration(time_total/4/2)
            .attr('width', 0)

    svg.append('rect') // left
        .attr('x', B -timer_size)
        .attr('y', B -timer_size)
        .attr('width', timer_size)
        .attr('height', SIZE + (timer_size))
        .attr('fill', `rgb(${red}, ${green}, ${blue})`)
        .transition()
            .ease(d3.easeLinear)
            .delay(time_total/4/2)
            .duration(time_total/4)
            .attr('y', B + SIZE)
            .attr('height', 0)
    
    svg.append('rect') // bottom
        .attr('x', B - timer_size)
        .attr('y', B + SIZE)
        .attr('width', SIZE + timer_size)
        .attr('height', timer_size)
        .attr('fill', `rgb(${red}, ${green}, ${blue})`)
        .transition()
            .ease(d3.easeLinear)
            .delay((time_total/4/2) + (time_total/4))
            .duration(time_total/4)
            .attr('x', B +SIZE)
            .attr('width', 0)

    svg.append('rect') // right
        .attr('x', B +SIZE)
        .attr('y', B)
        .attr('width', timer_size)
        .attr('height', SIZE + (timer_size))
        .attr('fill', `rgb(${red}, ${green}, ${blue})`)
        .transition()
            .ease(d3.easeLinear)
            .delay((time_total/4/2) + (2*time_total/4))
            .duration(time_total/4)
            .attr('height', 0)
    
    svg.append('rect') // top right
        .attr('x', B + (SIZE/2))
        .attr('y', B - timer_size)
        .attr('width', (SIZE/2) + timer_size)
        .attr('height', timer_size)
        .attr('fill', `rgb(${red}, ${green}, ${blue})`)
        .transition()
            .ease(d3.easeLinear)
            .delay((time_total/4/2) + (3*time_total/4))
            .duration(time_total/4/2)
            .attr('width', 0)

    return
    }

// generate a random integer from min to max inclusive
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

// generate a random game state
function generateState(score, isFake) {

    // has the identical guessable square been set yet
    var identicalPicked = false

    // generate color for the main square
    var red = randInt(0,150)
    var green = randInt(0,150)
    var blue = randInt(0,150)
    var true_color_array = [red, green, blue]

    // generate timer
    createTimer(red, green, blue, isFake)

    // generate main square
    createMainSquare(red, green, blue)

    // generate score number
    svg.append("text")
        .attr("x", B + (0.5*SIZE))
        .attr("y", B + (0.5*SIZE))
        .attr("dy", ".35em")
        .attr("font-size","5em")
        .style("text-anchor", "middle")
        .style("fill","white")
        .text(`${score}`)

    // loop eight times (for each guessable square location)
    for (let i = 0; i < 8; i++) {

        // generate random variance for each guessable color
        var red_var = randInt(15,20)
        if (randInt(0,1) == 0) {
            red_var *= -1
        }
        var green_var = randInt(15,20)
        if (randInt(0,1) == 0) {
            green_var *= -1
        }
        var blue_var = randInt(15,20)
        if (randInt(0,1) == 0) {
            blue_var *= -1
        }

        // receive location of current guessable square in loop
        var x = GUESSABLE_SQUARES[i][0]
        var y = GUESSABLE_SQUARES[i][1]

        // 1/8th chance of assigning the correct color guess
        if ((randInt(0,7) == 0) && identicalPicked == false) {
            createGuessableSquare(x, y, red, green, blue, true_color_array, score)
            identicalPicked = true
        }
        // resort to final guessable square if the correct color guess has not yet been picked
        else if ((i == 7) && identicalPicked == false) {
            createGuessableSquare(x, y, red, green, blue, true_color_array, score)
            identicalPicked = true
        }
        // generate guessable square with location and variance in color
        else {
            createGuessableSquare(x, y, red + red_var, green + green_var, blue + blue_var, true_color_array, score)
        }
    }
    return true_color_array
}

// generate a new state with a score of zero
function restartGame(isFake) {
    d3.selectAll("svg > *").remove(); // clear svg
    score = 0 // reset score
    true_color_array = generateState(score, isFake)
    return true_color_array
}

// generate a new state with a score increased by one
function continueGame() {
    d3.selectAll("svg > *").remove(); // clear svg
    score += 1 // increase score
    generateState(score)
}

// validate the chosen color as correct or wrong
function validateChoice(chosen_color, true_color_array, score) {
    console.log("chosen: ", chosen_color)
    console.log(`correct: rgb(${true_color_array[0]}, ${true_color_array[1]}, ${true_color_array[2]})`)

    // clear the timeout once a decision is made
    clearTimeout(resetTimeout);

    if (chosen_color == `rgb(${true_color_array[0]}, ${true_color_array[1]}, ${true_color_array[2]})`) {
        continueGame(score)
    }
    else {
        openMenu(score, true_color_array)
    }
}

// generate a menu screen based on true color of the last game state
function openMenu(score, true_color_array) {

    // set true color string
    true_color = `rgb(${true_color_array[0]}, ${true_color_array[1]}, ${true_color_array[2]})`

    // retrieve highscore for local storage
    highscore = localStorage.getItem("highscore");

    // reset highscore if applicable
    if (highscore !== null){
        if (score > highscore) {
            localStorage.setItem("highscore", score);      
        }
    }
    else {
        localStorage.setItem("highscore", score);
    }

    // overlay game with an opaque white rectangle
    svg.append('rect')
        .attr('x', OUTER_MARGIN - 1)
        .attr('y', OUTER_MARGIN - 1)
        .attr('width', (3*SIZE) + (2*INNER_MARGIN) + 2)
        .attr('height', (3*SIZE) + (2*INNER_MARGIN) + 2)
        .attr('fill', 'white')
        .style("opacity", 0.9)
    
    // print current highscore
    svg.append("text")
        .attr("x", B + (0.5*SIZE))
        .attr("y", (0.5*OUTER_MARGIN))
        .attr("dy", ".35em")
        .attr("font-size","2em")
        .style("text-anchor", "middle")
        .style("fill",true_color)
        .text(`highscore: ${localStorage.getItem("highscore")}`)

    // print play button
    svg.append("text")
        .attr("x", B + (0.5*SIZE))
        .attr("y", B + (0.5*SIZE))
        .attr("dy", ".25em")
        .attr("font-size","6em")
        .style("text-anchor", "middle")
        .style("fill",true_color)
        .text('play')
        .on('mouseover', function() {
            d3.select(this)
                .attr('stroke', true_color)
        })
        .on('mouseout', function() {
            d3.select(this)
                .attr('stroke', null)
                .style("fill", true_color)
        })
        .on('click', function() {
            restartGame(false)
        })

    }

true_color_array = restartGame(true) // generate a game state for the intial menu screen
openMenu(score, true_color_array) // open menu screen