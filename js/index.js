//Isomer.js references for shrothand, must be stored globally
let Shape = Isomer.Shape;
let Point = Isomer.Point;
let Color = Isomer.Color;
//Setting up canvas, context, and Isomer canvas
let iso = new Isomer(document.getElementById('art'));
let canvas = document.getElementById('art');
let context = canvas.getContext('2d');

//Preselected palletes for coloring isometric structures
let palletes = {
    dark: ['#baa7b0', '#b2abbf', '#b1b5c8', '#bfd5e2', '#c7ebf0'],
    cosmic: ['#edf67d', '#f896d8','#ca7df9','#724cf9','#564592'],
    sun: ['#a54657','#582630','#f7ee7f','#f1a66a','#f26157'],
    vibrant: ['#6699cc','#fff275','#ff8c42','#ff3c38','#a23e48'],
    blue: ['#143266', '#00487c','#027bce', '#0496ff', '#4bb3fd'],
    wine: ['#9e0031','#8e0045','#770058','#600047','#44001a'],
    pastel: ['#d6f6dd','#dac4f7','#f4989c','#ebd2b4','#acecf7'],
    mint: ['#91f9e5','#76f7bf','#5fdd9d','#499167','#3f4531'],
    rainbow: ['#f2ff49', '#ff4242', '#fb62f6','#645dd7','#b3fffc'],
    evil: ['#b80c09','#031a23','#1c0c12','#39393a','#040f16']
};

//State object for referencing page state
let state = {
    pallete: 'random',
    index: 0,
};

//Initialize a pattern on page load
window.onload = function() {
    generateRandomIso();
}

//Event-listener for 'Generate Pattern' button: clears the current pattern and displays a new one
document.getElementById('pattern').addEventListener("click", function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    generateRandomIso();
});

//Event-listener for 'Change Pallete' button: sets the pallete to the next pallete in the 'palletes' object
document.getElementById('pallete').addEventListener("click", function() {
    let colors = Object.keys(palletes);
    if (state.index === 9) {
        state.index = 0;
    } else {
        state.index++;
    }
    state.pallete = palletes[colors[state.index]];
    document.getElementById('current').innerHTML = 'Current Pallete:';
    renderPalette(state.pallete, document.getElementById('current'));
});

//Event-listener for 'Random Coloring' button: sets pallete state to 'random'
document.getElementById('coloring').addEventListener("click", function() {
    state.pallete = 'random';
    document.getElementById('current').innerHTML = 'Current Pallete: Random Coloring'
});

//Event-listener to download isometric art when download is clicked
document.getElementById('first-item').addEventListener("click", function() {
    let dataUrl = document.getElementById('art').toDataURL('image/png');
    let link = document.createElement('a');
    link.setAttribute('href', dataUrl);
    link.setAttribute('download', 'isometric.png');
    link.click();
});

//Generates a random Isometric structure, randomly selecting between
//a chain pattern, a scatter pattern, and a chain-scatter pattern
function generateRandomIso() {
    let randInt = getRandomNum(1,3); {
        if (randInt === 1) {
            generateScatter(3,3,3);
            generateScatter(2,2,2);
        } else if (randInt === 2) {
            generateChain(0,0,0);
        } else {
            generateScatter(3,3,3);
            generateScatter(2,2,2);
            generateChain(0,0,0);
        }
    }
}

//Generates a chain of isometric blocks randomly
//Takes in a value for the x, y, and z location of the origin for the chain
function generateChain(xOrigin, yOrigin, zOrigin) {
    let x = xOrigin;
    let y = yOrigin;
    let z = zOrigin;
    for (let i = 0; i < 6; i++) {
        //Allow chain to establish origin cube on first iteration 
        if (i !== 0) {
            //Chain another block in a random direction
            let rand = getRandomNum(1, 3);
            if (rand === 1) {
                z++;
            } else if (rand === 2) {
                y++;
            } else {
                x++;
            }
        }
        //Add according shape color based on state    
        if (state.pallete === 'random') {
            iso.add(Shape.Prism(new Point(x,y,z)), getRandomColor());
        } else {
            let color = hexToRgb(state.pallete[getRandomNum(0,4)]);
            iso.add(Shape.Prism(new Point(x,y,z)), color);
        }
    }
}

//Generates a random scatter of isometric block within given bounds
//Takes in a value for the x, y, and z bounds (from origin) of the random scatter.
function generateScatter(xBound, yBound, zBound) {
    for (let i = 0; i < 6; i++) {
        if (state.pallete === 'random') {
            iso.add(Shape.Prism(getRandomPoint(xBound, yBound, zBound)), getRandomColor());
        } else {
            let color = hexToRgb(state.pallete[getRandomNum(0,4)]);
            iso.add(Shape.Prism(getRandomPoint(xBound, yBound, zBound)), color);
        }
    }
}

//Generates a random whole number between a given minimum and maximum
//Takes in a number for the minimum and maximum value that the number can be
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Generates a new Isomer Point given the bounds of each dimension
//Takes in a value for the x, y, and z coordinates of the point
function getRandomPoint(xBound, yBound, zBound) {
    let x = getRandomNum(0, xBound)
    let y = getRandomNum(0, yBound)
    let z = getRandomNum(0, zBound)
    return new Point(x, y, z);
}

//Generate a random color with a random opacity
function getRandomColor() {
    let red = getRandomNum(0, 255);
    let green = getRandomNum(0, 255);
    let blue = getRandomNum(0, 255);
    let opacity = (Math.random() * 2) - 1;
    if (opacity < 0) {
        return new Color(red, blue, green);
    } else {
        return new Color(red, blue, green, opacity);
    }
}

//Function to convert hex colors in the form "#000000" into an Isomer.Color
//Takes in a hex color value as a string
function hexToRgb(hex) {
    hex = hex.substr(1);
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return new Color(r,g,b);
}

//Generates a color pallete and appends it to a given parent
//Takes in an array of colors in hex form and a parent element
function renderPalette(colors, parent) {
    let row = document.createElement('div');
    for (let i = 0; i < colors.length; i++) {
        row.appendChild(createColorBox(colors[i], 30));
    }
    parent.appendChild(row);
}

//Generates a color box given a color and size
function createColorBox(color, size) {
    let div = document.createElement('div');
    div.classList.add('d-inline-block');
    div.style.backgroundColor = color;
    div.style.width = size + 'px';
    div.style.height = size + 'px';
    return div;
}