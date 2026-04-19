function openEnvelope() {

    document.querySelector(".envelope").style.display = "none";

    document.getElementById("letter").style.display = "block";

}

function toggleMusic() {

    let music = document.getElementById("music");

    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }

}
