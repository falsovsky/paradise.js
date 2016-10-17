var canvas;
var context;
var images = {};
var totalResources = 0;
var numResourcesLoaded = 0;
var selected = 0;
var frame = 0;
var strokes = 0;
var myTimer;

function reset() {
    selected = 0;
    frame = 0;
    strokes = 0;
    room();
}


/**
 * @author cc
 * Unified func for keydown and touch events
 */
function doAction(actionID) {

    if(selected === 0) {

        switch(actionID) {
            case 70:
                selected = 1;
                context.drawImage(images["balloon_vaginal"], 0, 0);
                setTimeout(vaginal, 2500);
                break;
            case 67:
                selected = 1;
                context.drawImage(images["balloon_anal"], 0, 0);
                setTimeout(anal, 2500);
                break;
            case 66:
                selected = 1;
                context.drawImage(images["balloon_oral"], 0, 0);
                setTimeout(oral, 2500);
                break;
        }
    }
}

function prepareCanvas(canvasDiv, canvasWidth, canvasHeight)
{
    // Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'canvas');
    canvasDiv.appendChild(canvas);
    
    if(typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d"); // Grab the 2d canvas context
    // Note: The above code is a workaround for IE 8and lower. Otherwise we could have used:
    //     context = document.getElementById('canvas').getContext("2d");
    

    /**
     * @author: cc
     * Do device validation, fix layout and assign their events
     */

    //Check device
    if( navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
        navigator.userAgent.match(/IEMobile/i) ) {          //is mobile

            document.getElementById("infoDiv").style.display = "none";
            var elems = document.getElementById("touch-elems").getElementsByTagName("li");
            for(var i = 0; i < elems.length; i++) {
                elems[i].addEventListener("click", function(e) {

                    doAction( parseInt(e.target.id) );
                }, true);
            }
    } else {                                                //is desktop

       document.getElementById("infoTouchDiv").style.display = "none";
        window.addEventListener('keydown', function(e) {
            doAction(e.keyCode);
        }, true);
    }

    var myImages = [
        "room", "whore", "hero", "balloon_choose",

        "balloon_vaginal", "balloon_oral", "balloon_anal",

        "vaginal_base", "vaginal_frame1", "vaginal_frame2",
        "vaginal_balloon_venho",

        "anal_base", "anal_frame1", "anal_frame2", "anal_balloon_grosso",
        "anal_balloon_clear", "anal_balloon_aaaa",

        "oral_base", "oral_frame1", "oral_frame2", "oral_balloon_chupa"
    ];

    totalResources = myImages.length;

    for (var i = 0; i < totalResources; i++) {
        loadImage(myImages[i]);
    }
}

function loadImage(name)
{
    images[name] = new Image();
    images[name].onload = function() { 
        resourceLoaded();
    }
    images[name].src = name + ".png";
}

function resourceLoaded()
{
    numResourcesLoaded += 1;
    if(numResourcesLoaded === totalResources) {
        room();
    }
}

function room() {
    canvas.width = canvas.width;

    context.drawImage(images["room"], 0, 0);
    context.drawImage(images["whore"], 0, 0);
    context.drawImage(images["hero"], 0, 0);
    context.drawImage(images["balloon_choose"], 0, 0);
}

function vaginal() {
    canvas.width = canvas.width;

    context.drawImage(images["room"], 0, 0);
    context.drawImage(images["vaginal_base"], 0, 0);
    context.drawImage(images["vaginal_frame1"], 0, 0);

    myTimer = setInterval(vaginalAnimate, 750);
}

function vaginalAnimate() {
    if (strokes < 25) {
        switch(frame) {
            case 0:
                context.drawImage(images["vaginal_frame1"], 0, 0);
                frame = 1;
                break;
            case 1:
                context.drawImage(images["vaginal_frame2"], 0, 0);
                frame = 0;
                strokes++;
                break;
        }

        if (strokes == 19) {
            context.drawImage(images["vaginal_balloon_venho"], 0, 0);
        }
    } else {
        context.drawImage(images["vaginal_frame1"], 0, 0);
        clearInterval(myTimer);
        setTimeout(reset, 2500);
    }
}

function anal() {
    canvas.width = canvas.width;

    context.drawImage(images["room"], 0, 0);
    context.drawImage(images["anal_base"], 0, 0);
    context.drawImage(images["anal_frame1"], 0, 0);

    myTimer = setInterval(analAnimate, 750);
}

function analAnimate() {
    if (strokes < 22) {
        switch(frame) {
            case 0:
                context.drawImage(images["anal_frame1"], 0, 0);
                frame = 1;
                break;
            case 1:
                context.drawImage(images["anal_frame2"], 0, 0);
                frame = 0;
                strokes++;
                break;
        }

        if (strokes == 4) {
            context.drawImage(images["anal_balloon_grosso"], 0, 0);
        }

        if (strokes == 16) {
            context.drawImage(images["anal_balloon_clear"], 0, 0);
        }

        if (strokes == 19) {
            context.drawImage(images["anal_balloon_aaaa"], 0, 0);
        }

    } else {
        context.drawImage(images["anal_frame1"], 0, 0);
        clearInterval(myTimer);
        setTimeout(reset, 2500);
    }
}

function oral() {
    canvas.width = canvas.width;

    context.drawImage(images["room"], 0, 0);
    context.drawImage(images["oral_base"], 0, 0);
    context.drawImage(images["oral_frame1"], 0, 0);

    myTimer = setInterval(oralAnimate, 750);
}

function oralAnimate() {
    if (strokes < 20) {
        switch(frame) {
            case 0:
                context.drawImage(images["oral_frame1"], 0, 0);
                frame = 1;
                break;
            case 1:
                context.drawImage(images["oral_frame2"], 0, 0);
                frame = 0;
                strokes++;
                break;
        }

        if (strokes == 4) {
            context.drawImage(images["oral_balloon_chupa"], 0, 0);
        }
    } else {
        context.drawImage(images["oral_frame1"], 0, 0);
        clearInterval(myTimer);
        setTimeout(reset, 2500);
    }
}