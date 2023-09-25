const player = document.getElementById('player');
const pauseBtn = document.querySelector('.pause');
const playBtn = document.querySelector('.play');
const nextBtn = document.querySelector('.next');
const marquee = document.querySelector('.dotted');
let index = 0;
const tracks = [
    'Daft Punk - Make Love.mp3',
    'Kavinsky - Nightcall.mp3',
    'Kyle dixon and michael stein - Kids.mp3',
    'Timecop1983 - On the Run.mp3',
    'Cinnamon Chasers - Luv Deluxe.mp3'    
];
const musicPlay = () => {
    if (!player.paused) return;
    document.querySelector('.dotted').classList.remove('hidden');
    if (!player.src)
    {
        nextSong();
        marquee.start();
        return;
    }
    player.play();    
    marquee.start();
}
const musicPause = () => {
    player.pause();
    marquee.stop();
}
const nextSong = () => {
    const src = tracks[index];
    index++;
    if (index === tracks.length)
        index = 0;
    player.src = './musics/' + src;    
    player.pause();
    player.load();
    player.play();
    document.querySelector('.dotted').classList.remove('hidden');
    marquee.start();
    document.querySelector('.dotted').textContent = src;
}
pauseBtn.addEventListener('click', musicPause);
playBtn.addEventListener('click', musicPlay);
nextBtn.addEventListener('click', nextSong);
player.addEventListener('ended', nextSong);