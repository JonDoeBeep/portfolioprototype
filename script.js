import $ from "https://esm.sh/jquery";
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let isOnDiv = false;
let j = "000000";
let o = "ffffff";
let l = 0;
var divM = document.getElementById("main");
let h1 = document.querySelectorAll(".shownLater");

let a1 = document.getElementById("a1");
let mouseMoved = true;

var speed = "slow";

$("html, body").hide();

$(document).ready(function () {
  $("html, body").fadeIn(speed, function () {
    $("a[href], button[href]").click(function (event) {
      var url = $(this).attr("href");
      if (url.indexOf("#") == 0 || url.indexOf("javascript:") == 0) return;
      event.preventDefault();
      $("html, body").fadeOut(speed, function () {
        window.location = url;
      });
    });
  });
});

function waitMSec(x) {
  let a = new Date().getTime();
  let b = start;
  while (a < b + x) {
    b = new Date().getTime(); // this sucks but it will pause my code
  }
}

const pointer = {
  x: 0.5 * window.innerWidth,
  y: 0.5 * window.innerHeight
};
const params = {
  pointsNumber: 80,
  widthFactor: 0.15,
  mouseThreshold: 0.6,
  spring: 0.4,
  friction: 0.5
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
  trail[i] = {
    x: pointer.x,
    y: pointer.y,
    dx: 0,
    dy: 0
  };
}

window.addEventListener("click", (e) => {
  updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("mousemove", (e) => {
  mouseMoved = true;
  updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("touchmove", (e) => {
  mouseMoved = true;
  updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

function updateMousePosition(eX, eY) {
  pointer.x = eX;
  pointer.y = eY;
}

setupCanvas();
update(0);
window.addEventListener("resize", setupCanvas);

function update(t) {
  // for intro motion
  if (!mouseMoved) {
    pointer.x =
      (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) *
      window.innerWidth;
    pointer.y =
      (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t)) *
      window.innerHeight;
  }

  ctx.strokeStyle = "white";
  ctx.fillStyle = `#${j}`;
  ctx.strokeStyle = `#${o}`;
  for (let i = 0; i < h1.length; i++) {
    h1[i].style.color = `#${o}`;
  }

  let c = document.getElementById("main");
  c.addEventListener("mouseenter", function () {
    isOnDiv = true;
  });
  if (isOnDiv) {
    if (j == "1010100") {
      for (let i = 0; i < h1.length; i++) {
        h1[i].style.visibility = "visible";
      }
      a1.style.visibility = "hidden";
      if (o == "101010") {
        // do nothing
      } else {
        let num = parseInt(o, 16);
        num -= 0x010101;
        o = num.toString(16).padStart(6, "");
        console.log(o);
      }
    } else {
      let num = parseInt(j, 16);
      num += 0x010101;
      if ((num += 0x010101).toString(16).padStart(6, "") == "ffffff") {
        num += 0x010101;
        waitMSec(2000);
      }
      j = num.toString(16).padStart(6, "");
      console.log(j);
    }
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  trail.forEach((p, pIdx) => {
    const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
    const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;
    p.dx += (prev.x - p.x) * spring;
    p.dy += (prev.y - p.y) * spring;
    p.dx *= params.friction;
    p.dy *= params.friction;
    p.x += p.dx;
    p.y += p.dy;
  });
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(trail[0].x, trail[0].y);

  for (let i = 1; i < trail.length - 1; i++) {
    const xc = 0.5 * (trail[i].x + trail[i + 1].x);
    const yc = 0.5 * (trail[i].y + trail[i + 1].y);
    ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
    ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
    ctx.stroke();
  }
  ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
  ctx.stroke();

  window.requestAnimationFrame(update);
}

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
