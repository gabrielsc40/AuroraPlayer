const nomeMusica = document.getElementById('nome_musica');
const nomeBanda = document.getElementById('nome_banda');

const song = document.getElementById('audio');
const capa = document.getElementById('capa_musica');

const play = document.getElementById('play');
const next = document.getElementById('next');
const anterior = document.getElementById('anterior');
const like = document.getElementById('favorito');
const progressoAtual = document.getElementById('progresso_atual');
const progressContainer = document.getElementById('progress-container');
const botaoEmbaralhar = document.getElementById('embaralhar');
const botaoRepetir = document.getElementById('repetir');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');


const Next_To_Me = {
    nomeMusica: "Next To Me",
    nomeArtista: "Imagine Dragons",
    arquivo: "Next To Me",
    liked: false
};
const The_Scientist = {
    nomeMusica: "The Scientist",
    nomeArtista: "Coldplay",
    arquivo: "The Scientist",
    liked: true
};
const Yellow = {
    nomeMusica: "Yellow",
    nomeArtista: "Coldplay",
    arquivo: "Yellow",
    liked: false
};

let tocando = false;
let embaralhado = false;
let habilitadoRepetir = false;

const playlist = JSON.parse(localStorage.getItem('playlistCasaNova')) || [Next_To_Me, The_Scientist, Yellow];
let sorteioPlaylist = [...playlist];

let index = 0;

function playSong() {
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    tocando = true;
}

function pauseSong() {
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    song.pause();
    tocando = false;
}

function decidirTocarMusica() {
    if (tocando === true) {
        pauseSong();
    } else {
        playSong();
    }
}

function botaoDeLike() {
    if (sorteioPlaylist[index].liked === true) {
        like.querySelector('.bi').classList.remove('bi-heart');
        like.querySelector('.bi').classList.add('bi-heart-fill');
        like.classList.add('botao_ativo');
    } else {
        like.querySelector('.bi').classList.add('bi-heart');
        like.querySelector('.bi').classList.remove('bi-heart-fill');
        like.classList.remove('botao_ativo');
    }
}

function inicializarmusica() {
    capa.src = `img/${sorteioPlaylist[index].arquivo}.jpg`;
    song.src = `musicas/${sorteioPlaylist[index].arquivo}.mp3`;
    nomeMusica.innerText = sorteioPlaylist[index].nomeMusica;
    nomeBanda.innerText = sorteioPlaylist[index].nomeArtista;
    botaoDeLike();
}

function musicaAnterior() {
    if (index === 0) {
        index = sorteioPlaylist.length - 1;
    } else {
        index -= 1;
    }
    inicializarmusica();
    playSong();
}

function nextMusica() {
    if (index === sorteioPlaylist.length - 1) {
        index = 0;
    } else {
        index += 1;
    }
    inicializarmusica();
    playSong();
}

function atualizarProgresso() {
    const larguraBarra = (song.currentTime / song.duration) * 100;
    progressoAtual.style.setProperty('--progress', `${larguraBarra}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event) {
    const largura = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / largura) * song.duration;
    song.currentTime = jumpToTime;
}

function embaralharArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }
}

function embaralhar() {
    if (embaralhado === false) {
        embaralhado = true;
        embaralharArray(sorteioPlaylist);
        botaoEmbaralhar.classList.add('botao_ativo');
    } else {
        embaralhado = false;
        sorteioPlaylist = [...playlist];
        botaoEmbaralhar.classList.remove('botao_ativo');
    }
}

function repetirMusica() {
    if (habilitadoRepetir === false) {
        habilitadoRepetir = true;
        botaoRepetir.classList.add('botao_ativo');
    } else {
        habilitadoRepetir = false;
        botaoRepetir.classList.remove('botao_ativo');
    }
}

function nextOrRepeat() {
    if (habilitadoRepetir === false) {
        nextMusica();
    } else {
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let seg = Math.floor(originalNumber - hours * 3600 - min * 60);
    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

function atualizarTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function botaoClickLike() {
    if (sorteioPlaylist[index].liked === false) {
        sorteioPlaylist[index].liked = true;
    } else {
        sorteioPlaylist[index].liked = false;
    }
    botaoDeLike();
    localStorage.setItem('playlistCasaNova', JSON.stringify(playlist));
}

inicializarmusica();

play.addEventListener('click', decidirTocarMusica);
anterior.addEventListener('click', musicaAnterior);
next.addEventListener('click', nextMusica);
song.addEventListener('timeupdate', atualizarProgresso);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', atualizarTotalTime);
progressContainer.addEventListener('click', jumpTo);
botaoEmbaralhar.addEventListener('click', embaralhar);
botaoRepetir.addEventListener('click', repetirMusica);
like.addEventListener('click', botaoClickLike);