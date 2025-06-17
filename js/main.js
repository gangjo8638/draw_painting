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





/**비디오배경 
document.addEventListener("scroll", function () {
    let videoContainer = document.querySelector(".video-container");
    let videoSection = document.getElementById("video-section");
    let sectionTop = videoSection.getBoundingClientRect().top;

    // 스크롤이 특정 위치에 도달하면 화면을 꽉 채우도록 확장
    if (sectionTop <= window.innerHeight / 2) {
        videoContainer.style.width = "100vw";
        videoContainer.style.height = "100vh";
        videoContainer.style.borderRadius = "0";
        videoContainer.style.transform = "translate(-50%, -50%) scale(1)";
    } else {
        // 다시 위로 스크롤하면 원래 크기로 복귀
        videoContainer.style.width = "50vw";
        videoContainer.style.height = "50vh";
        videoContainer.style.borderRadius = "0";
        videoContainer.style.transform = "translate(-50%, -50%) scale(1)";
    }
});
*/

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




const cursor = document.querySelector('.custom-cursor');
let mouseX = 0, mouseY = 0;  // 실제 마우스 위치
let cursorX = 0, cursorY = 0;  // 커서가 이동할 위치
const delay = 0.3;  // 딜레이 정도 (0.1 ~ 0.3 추천)

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * delay;
    cursorY += (mouseY - cursorY) * delay;
    cursor.style.transform = `translate(${cursorX - 15}px, ${cursorY - 15}px)`;
    requestAnimationFrame(animateCursor);
}
animateCursor();  // 애니메이션 시작

document.querySelectorAll('#about_1').forEach((element) => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });

    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });
});

document.querySelectorAll('.custom-top-button').forEach((element) => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('active_2');
    });

    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active_2');
    });
});
document.querySelectorAll('.section #content').forEach((element) => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('active_3');
    });

    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active_3');
    });
});
document.querySelectorAll('.tv-body').forEach((element) => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('active_4');
    });

    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active_4');
    });
});



// 모든 리소스가 로드될 때 실행
window.addEventListener("load", function () {
    let loader = document.querySelector(".loader");
    let content = document.querySelector(".content");

    // 로딩 화면 부드럽게 사라지게 하기
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";

    // 로딩 화면이 완전히 사라진 후 콘텐츠 표시
    setTimeout(() => {
        loader.style.display = "none";
        content.style.display = "block";
    }, 500); // CSS 애니메이션 시간과 맞춤
});



//스크롤바
const progressBar = document.getElementById('progressBar');
const sectionInfo = document.getElementById('sectionInfo');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.height = scrollPercent + "%";

    const currentSection = Math.floor(scrollTop / window.innerHeight) + 1;
    //sectionInfo.textContent = `${currentSection}`;
});


//이미지
/*
const targetImg = document.querySelector('#section-2 img');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            targetImg.classList.add('show');
        } else {
            targetImg.classList.remove('show');
        }
    });
}, {
    threshold: 0.5 //세션 50프로가 보이면 등장
});

observer.observe(targetImg);
*/gsap.registerPlugin(ScrollTrigger);

const section2 = document.querySelector("#section-2");
const image = section2.querySelector("img");
const introText = section2.querySelector(".intro-text");

// 글자를 span으로 나눔
const text = introText.textContent.trim();
introText.innerHTML = "";

const spans = text.split("").map((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    introText.appendChild(span);
    return span;
});

// 이미지 등장
ScrollTrigger.create({
    trigger: section2,
    start: "top 30%", //이거 줄이면 늦게 나옴
    onEnter: () => {
        image.classList.add("show");
    },
    onLeaveBack: () => {
        image.classList.remove("show");
    }
});

// 글자 하나씩 색이 채워지도록 스크롤 비율로 제어
gsap.to(spans, {
    scrollTrigger: {
        trigger: section2,
        start: "top 0%", //이거 줄이면 늦게 나옴
        end: "bottom 0%",
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const total = spans.length;
            const current = Math.floor(progress * total);

            spans.forEach((span, i) => {
                if (i <= current) {
                    span.classList.add("show");
                } else {
                    span.classList.remove("show");
                }
            });
        }
    }
});

// 섹션 고정
ScrollTrigger.create({
    trigger: section2,
    start: "top top",
    end: "+=200%",
    pin: true,
    pinSpacing: true,
    scrub: true
});



/*아코디언 기능 */
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const arrowIcon = item.querySelector('.arrow-icon');

    header.addEventListener('click', () => {
        // 👇 이 부분 제거하면 여러 개 열 수 있어요!
        // accordionItems.forEach(otherItem => {
        //     if (otherItem !== item) {
        //         otherItem.classList.remove('active');
        //         const otherArrow = otherItem.querySelector('.arrow-icon');
        //         if (otherArrow) {
        //             otherArrow.src = 'arrow-down.svg';
        //         }
        //     }
        // });

        // 현재 아코디언 토글
        item.classList.toggle('active');

        // 아이콘 이미지 변경
        if (item.classList.contains('active')) {
            arrowIcon.src = 'arrow-up.svg';
        } else {
            arrowIcon.src = 'arrow-down.svg';
        }
    });
});

/*사진 */
/* 기본본
const swiper = new Swiper(".mySwiper", {
    loop: true, // 무한루프
    slidesPerView: 5,
    spaceBetween: 10,
    grabCursor: true,
    autoplay: {
        delay: 3000, //자동으로 넘어감감
        disableOnInteraction: false,
    },
    breakpoints: {
        320: {
            slidesPerView: 1
        },
        375: {
            slidesPerView: 1
        },
        425: {
            slidesPerView: 2
        },
        768: {
            slidesPerView: 3
        },
        1024: {
            slidesPerView: 5
        }
    }
});
*/
const swiper = new Swiper(".mySwiper", {
    loop: true,
    slidesPerView: 5,
    spaceBetween: 10,
    grabCursor: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    breakpoints: {
        320: { slidesPerView: 1 },
        375: { slidesPerView: 1 },
        425: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 5 },
    },
    on: {
        slideChangeTransitionEnd: function () {
            updateActiveSlide();
        },
        init: function () {
            updateActiveSlide();
        }
    }
});

function updateActiveSlide() {
    const slides = document.querySelectorAll(".swiper-slide");
    slides.forEach(slide => slide.classList.remove("active-slide"));

    // 현재 보여지는 첫 번째 슬라이드에만 클래스 추가
    const firstVisibleSlide = document.querySelector(".swiper-slide-active");
    if (firstVisibleSlide) {
        firstVisibleSlide.classList.add("active-slide");
    }
}



const video = document.getElementById("background-video");
const wrapper = document.getElementById("tvWrapper");

// 비디오 반복 재생
video.addEventListener("ended", () => {
    video.pause();
    setTimeout(() => {
        video.currentTime = 0;
        video.play();
    }, 1000);
});

// 마우스 따라다니기
const screen = document.querySelector('.tv-screen');
screen.addEventListener('mousemove', (e) => {
    const rect = screen.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const moveX = x * 20;
    const moveY = y * 20;
    video.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

screen.addEventListener('mouseleave', () => {
    video.style.transform = 'translate(0, 0)';
});

// 스크롤에 따라 이동
window.addEventListener('scroll', () => {
    const section = document.getElementById('video-section');
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const visibleRatio = 1 - Math.max(0, Math.min(1, rect.top / windowHeight));
    const moveX = 50 - (visibleRatio * 100); // 50 → -50
    wrapper.style.transform = `translate(${moveX}%, -50%)`;
});


