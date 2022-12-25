    /*

The Game Project

Week 3

Game interaction

*/


/* NOTE:
   code is modulerised - check `/lib` files
*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var collectables;
var canyons;
var tree_x;
var clouds;
var cameraPosX;
var cameraLimits;

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
    
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    
    collectables = [
        {
            x_pos: 50,
            y_pos: floorPos_y,
            isFound: false,
        },
        {
            x_pos: 800,
            y_pos: floorPos_y,
            isFound: false,
        },
        {
            x_pos: 1300,
            y_pos: floorPos_y,
            isFound: false,
        }
    ]
    
    canyons = [
        {
            x_pos: 650,
            width: 130,
        },
        {
            x_pos: 1500,
            width: 180,
        }
    ]
    tree_x = [0, 900, 1800]
    clouds = [
        { x: 100, size: 1 },
        { x: 300, size: 2 },
        { x: 800, size: 1 },
        { x: 1300, size: 3 },
        { x: 1800, size: 2 },
    ]
    mountains = [
        {x: 200, size: 4},
        {x: 900, size: 5},
        {x: 2000, size: 2},
    ]
    cameraLimits = { left: 0, right: 2000 }
    cameraPosX = 0;
}

function draw()
{
	background(100,155,255); //fill the sky blue
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground

    push()
    translate(-cameraPosX, 0)

    // draw clouds
    drawClouds()

    // draw mountains
    drawMountains()

    for(var i = 0; i < canyons.length; i++)
    {
        var canyon = canyons[i]
            
        //draw the canyon
        drawCanyon(canyon)
            
        //canyon interaction
        checkCanyon(canyon)
    }

    // draw trees
    drawTrees()

    for (var i = 0; i < collectables.length; i++)
    {
        var collectable = collectables[i]

        //draw the collectable
        if (!collectable.isFound)
        { 
            drawCollectable(collectable)
        }
        
        //collectable interaction
        checkCollectable(collectable)
    }

    
    
	//the game character
	if(isLeft && isFalling)
	{
        charDrawSideJumping(gameChar_x, gameChar_y, false)
	}

	else if(isRight && isFalling)
	{
        charDrawSideJumping(gameChar_x, gameChar_y, true)
	}

	else if(isLeft)
	{
        charDrawSide(gameChar_x, gameChar_y, false)
	}

    else if(isRight)
	{
        charDrawSide(gameChar_x, gameChar_y, true)
	}

    else if(isFalling || isPlummeting)
	{
        charDrawFrontJump(gameChar_x, gameChar_y)
	}

    else
	{
        charDrawFront(gameChar_x, gameChar_y)
	}
    // end game char


	///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here

    if (isLeft)
    {
        gameChar_x -= 4

        // prevent screen translate when reached left limit
        if (gameChar_x > cameraLimits.left && gameChar_x < cameraLimits.right) {
            cameraPosX -= 4
        }
        
    }
    
    if (isRight)
    {
        gameChar_x += 4
        
        // prevent screen translate when reached right limit
        if (gameChar_x > cameraLimits.left && gameChar_x < cameraLimits.right) {
            cameraPosX += 4
        }
    }

    if ((gameChar_y > floorPos_y) && !isPlummeting)
    {
        isFalling = false
    } else {
        isFalling = true
        gameChar_y += 3
    }
    
    if (isPlummeting) {
        isLeft = false
        isRight = false
        gameChar_y += 5;
    }

    pop()

}

function drawClouds()
{
    var y = 100; // natural cloud position
    push()
    fill(255);

    for (var i = 0; i < clouds.length; i++) {

        var x = clouds[i].x
        var size = clouds[i].size

        ellipse(x, y, 20 * size, 20 * size);
        ellipse(x + 20 * size, y, 30 * size, 30 * size);
        ellipse(x + 35 * size, y, 20 * size, 20 * size);
        ellipse(x + 45 * size, y, 10 * size, 10 * size);
    }
    
    pop()
}

function drawMountains()
{
    var y = floorPos_y

	push()
	fill(100);

    for (var i = 0; i < mountains.length; i++) {
        var x = mountains[i].x
        var scaleFactor = mountains[i].size / 5

        triangle(
            x,y,
            x + 150 * scaleFactor , y - 182 * scaleFactor,
            x + 300 * scaleFactor, y
        );
        triangle(
            x - 50, y, 
            x + 50 * scaleFactor, y - 102 * scaleFactor,
            x + 250 * scaleFactor, y
        );
        triangle(
            x - 50, y,
            x + 200 * scaleFactor, y - 152 * scaleFactor,
            x + 350 * scaleFactor, y
        )
        triangle(
            x - 50, y,
            x + 300 * scaleFactor, y - 72 * scaleFactor,
            x + 410 * scaleFactor, y
        );
    }

	pop()
}

function drawTrees()
{
	push()


    for (var i = 0; i < tree_x.length; i++) {
        var x = tree_x[i]
        fill(150,75,0);
        rect(x, floorPos_y - 80, 20, 80);
        fill(0,100,0);
        ellipse(x + 10, floorPos_y - 124, 120, 100)
    }

	pop()
}

function drawCollectable(t_collectable)
{
    var x = t_collectable.x_pos
    var y = t_collectable.y_pos
    
	var center = {
		x,
		y: y - 18, 
	}	

	push()

	fill(240,220,0);   
	ellipse(center.x, center.y, 20, 30)
	fill(255,255,0);   
	ellipse(center.x, center.y, 15 , 20);
	strokeWeight(3);
	stroke(240,220,0); 
	line(center.x - 8, center.y, center.x + 8, center.y);
	pop()
}

function drawCanyon(t_canyon)
{
    var x = t_canyon.x_pos
    var y = height
    var canyon_width = t_canyon.width

	push()
	background
	fill(100, 155, 255);

	rect(x, floorPos_y, canyon_width, floorPos_y);
	
	// rocks
	fill(100, 50, 0);
	rect(x, y - 10, canyon_width, 10);
	triangle(
		x, y - 36,
		x + 20, y,
		x, y
	)
	triangle(
		x + canyon_width, y - 36,
		x + canyon_width - 20, y,
		x + canyon_width, y
	)
	rect(x, floorPos_y, 3, floorPos_y);
	rect(x + canyon_width - 3, floorPos_y, 3, floorPos_y);
	pop()
}

function checkCollectable(t_collectable)
{
    if (dist(t_collectable.x_pos, t_collectable.y_pos, gameChar_x, gameChar_y) < 24) {
        t_collectable.isFound = true
    }
}

function checkCanyon(t_canyon) {
    if (
        gameChar_y > floorPos_y &&
        gameChar_x > t_canyon.x_pos &&
        gameChar_x < t_canyon.x_pos + t_canyon.width
        
    ) {
        isPlummeting = true
    }
}

function keyPressed()
{
    if (isPlummeting) return
  
    if (keyCode == 65) {
        isLeft = true
    }
    
    if (keyCode == 68) {
        isRight = true
    }
    
    if (keyCode == 87 && !isFalling) {
        gameChar_y -=150
    }
}

function keyReleased()
{
    if (isPlummeting) return

    if (keyCode == 65) {
        isLeft = false
    }
    
    if (keyCode == 68) {
        isRight = false
    }
}
