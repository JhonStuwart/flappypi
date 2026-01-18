const audio = {
    wing: new Audio("assets/sounds/wing.wav"),
    hit: new Audio("assets/sounds/hit.wav"),
    die: new Audio("assets/sounds/die.wav"),
    point: new Audio("assets/sounds/point.wav"),
    swoosh: new Audio("assets/sounds/swoosh.wav"),
    menu: new Audio("assets/sounds/menu.mp3")
};

audio.menu.loop = true;
audio.menu.volume = 0.4;

audio.wing.volume = 0.8;
audio.point.volume = 0.7;
audio.hit.volume = 0.8;
audio.die.volume = 0.8;
audio.swoosh.volume = 0.6;
