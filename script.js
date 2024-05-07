let move_speed = 3,
    gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('gameover.mp3');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

function isFullScreen() {
    return (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    );
}

function adjustForFullScreen() {
    if (isFullScreen()) {
        move_speed = 20;
    } else {
        move_speed = 3;
    }
}

document.addEventListener("fullscreenchange", adjustForFullScreen);
document.addEventListener("webkitfullscreenchange", adjustForFullScreen);
document.addEventListener("mozfullscreenchange", adjustForFullScreen);
document.addEventListener("MSFullscreenChange", adjustForFullScreen);

document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state != 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        sound_die.pause();
        play();
    }
});


let backgroundAudio = document.getElementById('background-audio');


function adjustSizeAndSpeed() {
 
    let viewportWidth = window.innerWidth;

    if (viewportWidth > 1080) {
        bird.style.width = '180px';
        bird.style.height = '150px';
    } else {
        bird.style.width = '130px';
        bird.style.height = '100px';
    }

    
    if (viewportWidth > 1080) {
        move_speed = 10;
    } else {
        move_speed = 3;
    }
}


adjustSizeAndSpeed();
window.addEventListener('resize', adjustSizeAndSpeed);

backgroundAudio.currentTime = 3;
backgroundAudio.play();

function pauseBackgroundAudio() {
    backgroundAudio.pause();
}

function play() {
    function move() {
        if (game_state != 'Play') return;
    
        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();
    
            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top) {
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                   
                    let alternateImage = document.createElement('img');
                    alternateImage.src = 'gameover.png';
                    alternateImage.alt = 'Alternate Image';
                    alternateImage.classList.add('alternate-image');
                    message.appendChild(alternateImage);
                    pauseBackgroundAudio();
                    sound_die.currentTime = 5; 
                    sound_die.play();
                    pauseBackgroundAudio();
                    return;
                } else {
                    if (pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1') {
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();
                        element.scored = true; 
                        
                        let imageToShow = document.createElement('img');
                        imageToShow.src = 'imageToShow.png'; 
                        imageToShow.classList.add('show-image');
                        document.body.appendChild(imageToShow);
                        setTimeout(() => {
                            document.body.removeChild(imageToShow);
                        }, 500); 
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    
    requestAnimationFrame(move);

    let bird_dy = 0;

    function apply_gravity() {
        if (game_state != 'Play') return;
        bird_dy = bird_dy + gravity;
        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'images/PLANE.png';
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'images/PLANE.png';
            }
        });

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_separation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if (game_state != 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;

            let pipeTop = document.createElement('img');
            pipeTop.src = 'twin.png';
            pipeTop.className = 'pipe_sprite';
            pipeTop.style.top = pipe_posi - 70 + 'vh';
            pipeTop.style.left = '100vw';

            let pipeBottom = document.createElement('img');
            pipeBottom.src = 'twin.png';
            pipeBottom.className = 'pipe_sprite';
            pipeBottom.style.top = (pipe_posi + pipe_gap + 10) + 'vh';
            pipeBottom.style.left = '100vw';

            document.body.appendChild(pipeTop);
            document.body.appendChild(pipeBottom);
        }
        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }

    requestAnimationFrame(create_pipe);
}
