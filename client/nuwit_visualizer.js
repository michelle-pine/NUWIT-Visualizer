import Visualizer from './classes/visualizer'
import { interpolateBasis } from 'd3-interpolate'
import { sin, circle } from './util/canvas'

export default class NUWITVisualizer extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 20 })
    this.heights = {}
    for (let i = 0; i < 200; i++) { 
      this.heights[i] = Math.floor(Math.random() * Math.floor(20));
    }
    this.deg = 0;
    this.direction = 1;
  }

  hooks () {
    this.sync.on('bar', bar => {
      this.direction = this.direction * -1;
    })
  }

  paint ({ ctx, height, width, now }) {
    const beat = interpolateBasis([0, this.sync.volume * 100, 0])(this.sync.beat.progress)
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.deg = (this.deg + 1 % 360);
    ctx.fillStyle = 'white'
    var gradient = ctx.createLinearGradient(0,0, width,height);

    gradient.addColorStop(0, '#009897');
    gradient.addColorStop(.5, '#00b7b4');
    gradient.addColorStop(1, '#009897');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height)
    ctx.lineWidth = beat
    ctx.strokeStyle = 'white'
    sin(ctx, now / 100, height / 2, this.sync.volume * 50, 100)
    ctx.stroke()

    var circleX = width/ 2;
    var circleY = height / 2;
    var bars = 50;
    var barWidth = height / 100;
    var barHeight = beat + height / 10;
    var radius = height / 5;
    ctx.scale(1.5, 1.5);
    ctx.setTransform(1,0,0,1, circleX, circleY);
    circle(ctx, 0, 0, radius)
    ctx.lineWidth = this.sync.volume * height / 4;
    ctx.strokeStyle = "white"
    ctx.fillStyle = "rgba(0,0,0,0)"
    ctx.fill()
    ctx.stroke();
    circle(ctx, 0, 0, radius - height / 50)
    ctx.fillStyle = "#00b7b4"
    ctx.lineWidth = 0;
    ctx.stroke();
    ctx.fill()
    ctx.fillStyle = "black";
    var counter = 0;
    for(var i = 0; i < Math.PI*2; i+= (Math.PI*2 / bars)){
      var rad = i;
      ctx.setTransform(1,0,0,1, circleX, circleY);
      ctx.rotate(rad);
      ctx.rotate((this.deg * this.direction) * Math.PI / 180);
      ctx.translate(0, radius);
      // draw the bar
      ctx.scale(1.5, 1.5);
      ctx.fillRect(
        -barWidth/2, 
        0, 
        barWidth,
        barHeight + this.heights[counter] * 4, 
      );
      counter++;
    }
    ctx.restore()
    ctx.font = "15px Open Sans";
    ctx.fillStyle = "black";
    ctx.fillText("Now Playing ♬", 20, height - 78);
    ctx.font = "30px Open Sans";
    ctx.fillStyle = "white";
    ctx.fillText(this.sync.state.currentlyPlaying.name, 20, height - 45);
    ctx.font = "20px Open Sans";
    ctx.fillStyle = "black";
    ctx.fillText(this.sync.state.currentlyPlaying.artists[0].name, 20, height - 20);
  }
}