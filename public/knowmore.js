

window.onload = () => {
  // console.log("JS file loaded!");

  const canvas = document.getElementById('bg');
  const banner = document.querySelector("body");
  const ctx = canvas.getContext('2d');

  if (!canvas) {
    console.error("Canvas not found!");
    return;
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let dots = [];
  let arrayColor = ["#F4B342","#DE1A58" ,"#8F0177","#360185","#62109F","#002455"]
  for(let i = 0 ; i < 100; i++){
    dots.push({
      x : Math.floor(Math.random()*canvas.width),
      y : Math.floor(Math.random()*canvas.height),
      size : Math.random()*2+4,
      color : arrayColor[Math.floor(Math.random()*6)],
    })
  }
  // console.log(...dots);

  const drawDots = () => {
    dots.forEach(dot =>{
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(dot.x , dot.y , dot.size , 0 , Math.PI*2);
      ctx.fill();
    })
  }
  drawDots();

  banner.addEventListener('mousemove', (event)=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawDots();
    let mouse = {
      x : event.pageX - banner.getBoundingClientRect().left,
      y : event.pageY - banner.getBoundingClientRect().top,
    }

    dots.forEach(dot => {
      let distance = Math.sqrt((mouse.x - dot.x)**2 + (mouse.y - dot.y)**2);
      if(distance < 200){
        ctx.strokeStyle = dot.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(mouse.x , mouse.y);
        ctx.stroke();
      }
    });
  });

  banner.addEventListener('mouseout' , () =>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawDots();
  })
};
