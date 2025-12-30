/* ===================== Starfield Canvas ===================== */

const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.body.scrollHeight; // full page height
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);


let stars = [];
for (let i = 0; i < 300; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.5,
    // speed: speedHome,
  });
}

let val = 0;
const baseSpeed = 0.5;
let speedHome = 0.5;
let toast = 0;

if (document.body.classList.contains('home-page')) {  
  //toast
  const myToastEl = document.getElementById('myToast');
  const toast = new bootstrap.Toast(myToastEl);

  toast.show(); // automatically shows the toast

  // const speedbtn = document.getElementById('speedbutton');
  // let isPressed = false;

  // speedbtn.addEventListener("mousedown", () => {
  //   isPressed = true;
  // });

  // speedbtn.addEventListener("mouseup", () => {
  //   isPressed = false;
  // });

  // speedbtn.addEventListener("mouseleave", () => {
  //   isPressed = false;
  // });
  const speedButtons = document.querySelectorAll('.speedbutton');
  let isPressed = false;

  speedButtons.forEach(btn => {
    btn.addEventListener("mousedown", () => {
      isPressed = true;
    });

    btn.addEventListener("mouseup", () => {
      isPressed = false;
    });

    btn.addEventListener("mouseleave", () => {
      isPressed = false;
    });
  });

  function updateSpeed(){
    if(isPressed){
      val += 0.5;
      if (val > 25) val = 25;  // max speed
    }else{
      val = 0.5;
    }

    speedHome = baseSpeed + val;
    
    console.log(speedHome);
    requestAnimationFrame(updateSpeed);
  }

  updateSpeed();

}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    //ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`; // to make twinkle
    ctx.fillStyle = 'white';
    ctx.fill();
    star.y += speedHome; // <-- dynamically changing speed
    if (star.y > canvas.height) star.y = 0;
  }
  requestAnimationFrame(animateStars);
}
animateStars();


// // Handle window resize
// window.addEventListener('resize', () => {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// });



