const canvas = document.getElementById("fireworkCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.speed = speed;
        this.alpha = 1;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= 0.008;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.colors = ["rgba(98, 146, 128, 0.7)", "rgba(255,255,255,0.7)"];

        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 0.5;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.particles.push(new Particle(this.x, this.y, color, angle, speed));
        }
    }

    update() {
        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(particle => particle.alpha > 0);
    }

    draw() {
        this.particles.forEach(particle => particle.draw());
    }
}

let fireworks = [];

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });
    requestAnimationFrame(animate);
}

function createFirework(x, y) {
    fireworks.push(new Firework(x, y));
}

canvas.addEventListener("click", (event) => {
    createFirework(event.clientX, event.clientY);
});

function autoFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height / 2);
    createFirework(x, y);
    setTimeout(autoFirework, 900);
}

autoFirework();
animate();

document.addEventListener("DOMContentLoaded", function () {
    const title2 = document.getElementById("title_2");
    const text = title2.innerText;
    title2.innerHTML = "";
    text.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.innerText = char;
        span.style.animationDelay = `${index * 0.1}s`;
        title2.appendChild(span);
    });

    const menuBtn = document.getElementById("menuBtn");
    const menuOverlay = document.getElementById("menuOverlay");
    const closeBtn = document.getElementById("closeBtn");

    menuBtn.addEventListener("click", () => menuOverlay.classList.add("active"));
    closeBtn.addEventListener("click", () => menuOverlay.classList.remove("active"));
});





/**비디오배경 */
document.addEventListener("scroll", function () {
    let videoContainer = document.querySelector(".video-container");
    let videoSection = document.getElementById("video-section");
    let sectionTop = videoSection.getBoundingClientRect().top;

    // 스크롤이 특정 위치에 도달하면 화면을 꽉 채우도록 확장
    if (sectionTop <= window.innerHeight / 2) {
        videoContainer.style.width = "100vw";
        videoContainer.style.height = "100vh";
        videoContainer.style.borderRadius = "0";
        videoContainer.style.transform = "translate(-50%, -70%) scale(1)";
    } else {
        // 다시 위로 스크롤하면 원래 크기로 복귀
        videoContainer.style.width = "50vw";
        videoContainer.style.height = "50vh";
        videoContainer.style.borderRadius = "0";
        videoContainer.style.transform = "translate(-50%, -50%) scale(1)";
    }
});


/*글자가떨어지는 효과 */
document.addEventListener("DOMContentLoaded", function () {
    let title2 = document.getElementById("title_2");
    let text = title2.innerText; // 기존 텍스트 가져오기
    title2.innerHTML = ""; // 기존 내용 초기화

    // 글자마다 개별 <span> 태그 씌우기
    text.split("").forEach((char, index) => {
        let span = document.createElement("span");
        span.innerText = char;
        title2.appendChild(span);
    });
});


/**동영상 정지ㅣ */
const video = document.getElementById("background-video");

video.addEventListener("ended", function () {
    video.pause(); // 비디오 정지 (마지막 프레임 유지)

    setTimeout(() => {
        video.currentTime = 0; // 1초 후 다시 처음으로 이동
        video.play(); // 다시 재생
    }, 1000); // 1초 후 재생
});



/**스크롤에 의한 이미지+글자 등장 */
gsap.registerPlugin(ScrollTrigger);

// 글자를 개별 span으로 변환
const title = new SplitType("#title", { types: "chars" });
const content = new SplitType("#content", { types: "chars" });


// 1️⃣ 화면이 꽉 차면 고정
ScrollTrigger.create({
    trigger: "#animated-section",
    start: "top top",
    end: "+=200%",
    pin: true,
    anticipatePin: 1,
});


// 2️⃣ 이미지가 순차적으로 올라오면서 화면 밖으로 사라짐
function applyGsapAnimation() {
    let yValue = -window.innerHeight * 2.5;

    if (window.innerWidth >= 769 && window.innerWidth <= 1230) {
        yValue = -window.innerHeight * 3.1;
    } else if (window.innerWidth < 769) {
        yValue = -window.innerHeight * 3; // 모바일에서 조금 덜 올라가게
    } else if (window.innerHeight <= 425) {
        yValue = -window.innerHeight * 3; // 기본값
    }


    gsap.to(".image-container img", {
        y: yValue,
        duration: 2.5,
        stagger: 0.1,
        scrollTrigger: {
            trigger: "#animated-section",
            start: "top top",
            end: "top -150%",
            scrub: 2,
        }
    });
}

applyGsapAnimation();

window.addEventListener("resize", () => {
    gsap.killTweensOf(".image-container img");
    applyGsapAnimation();
});



// 3️⃣ 제목과 내용이 스크롤 시 한 글자씩 등장
gsap.to(".text-container", { opacity: 1, duration: 0.5 });


gsap.fromTo(
    "#title .char",
    { opacity: 0, y: 50 },
    {
        opacity: 1, y: 0, duration: 2.6, stagger: 2.08, ease: "power2.out",
        scrollTrigger: {
            trigger: "#animated-section",
            start: "top 60%",
            end: "top 30%",
            scrub: 1
        }
    }
);

gsap.fromTo(
    "#content .char",
    { opacity: 0, y: 50 },
    {
        opacity: 1,
        y: 0,
        duration: 3.5,  // 더 부드럽게
        stagger: 0.3,   // 글자 간 등장 간격 조정
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#animated-section",
            start: "top 50%",
            end: "top 20%",
            scrub: 3  // 더 부드럽게 조정
        }
    }
);


//줄바꿈
