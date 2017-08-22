var painter;
$(function() {
  painter = {
    getCanvas: function() {
      return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    },
    saveToUndo: function() {
      this.undos.push(this.getCanvas());
      if (this.undos.length > 100) this.undos.shift();
    },
    drawShape: function() {
      this.redos = [];
      this.saveToUndo();
      if (this.shape === 'triangle') this.drawTriangle();
      else if (this.shape === 'square') this.drawSquare();
      else if (this.shape === 'circle') this.drawCircle();
    },
    drawTriangle: function() {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - this.shapeSize, this.y + this.shapeSize);
      this.ctx.lineTo(this.x + this.shapeSize, this.y + this.shapeSize);
      this.ctx.lineTo(this.x, this.y - this.shapeSize);
      this.ctx.lineTo(this.x - this.shapeSize, this.y + this.shapeSize);
      this.ctx.closePath();
      this.ctx.fillStyle = this.fillColor;
      this.ctx.fill();
    },
    drawSquare: function() {
      this.ctx.fillStyle = this.fillColor;
      this.ctx.fillRect(this.x - this.shapeSize, this.y - this.shapeSize, this.shapeSize * 2, this.shapeSize * 2);
    },
    drawCircle: function() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.shapeSize, 0, 2 * Math.PI);
      this.ctx.closePath();
      this.ctx.fillStyle = this.fillColor;
      this.ctx.fill();
    },
    clearCanvas: function() {
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); 
    },
    undo: function() {
      if (this.undos.length === 0) return;
      else {
        this.redos.push(this.getCanvas());
        this.ctx.putImageData(this.undos.pop(), 0, 0);
      }
    },
    redo: function() {
      if (this.redos.length === 0) return;
      else {
        this.undos.push(this.getCanvas());
        this.ctx.putImageData(this.redos.pop(), 0, 0);
      }
    },
    bindEvents: function() {
      $('#shapes').on('click', 'input', this.handleSelectShape.bind(this));
      $('#clear').click(this.clearCanvas.bind(this));
      this.$colorInput.on('change keyup', this.handleColorInput.bind(this));
      $('input[type=number]').on('keyup click', this.handleShapeSize.bind(this));
      $('canvas').on('mousemove', this.handlePenMove.bind(this));
      $('canvas').on('mousedown', this.handlePenDown.bind(this)); 
      $('canvas').on('mouseup mouseleave', this.handlePenUp.bind(this));
      $('#eraser').click(this.handleEraser.bind(this));
      $(document).on('keydown', this.handleUndoRedo.bind(this));
      $('#download').on('click', this.handleDownload.bind(this));
    },
    handleSelectShape: function(e) { 
      this.shape = e.target.getAttribute('id');
      $('.active').toggleClass('active');
      e.target.classList += 'active';
    },
    handleColorInput: function(e) { 
      this.fillColor = e.target.value;
    },
    handleShapeSize: function(e) {
      this.shapeSize = +e.target.value;
    },
    handlePenMove: function(e) {
      this.x = e.offsetX;
      this.y = e.offsetY;
      if (this.holdClick) this.drawShape();
    },
    handlePenDown: function() {
      this.drawShape();
      this.holdClick = true;
    },
    handlePenUp: function() {
      this.holdClick = false;
    },
    handleEraser: function(e) {
      $(e.target).toggleClass('erase');
      this.fillColor = this.fillColor === 'white' ? this.$colorInput.val() : 'white';
    },
    handleUndoRedo: function(e) {
      e.stopPropagation();
      
      if (e.metaKey && e.key === 'x') this.redo();
      else if (e.metaKey && e.key === 'z') this.undo();
    },
    handleDownload: function(e) {
      e.target.href = this.canvas.toDataURL();
      e.target.download = $('#title').val();
    },
    init: function() {
      this.canvas = document.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.$colorInput = $('#color');

      this.shape = 'square';
      this.fillColor = 'black';
      this.x;
      this.y;
      this.holdClick;
      this.shapeSize = 25;
      this.undos = [];
      this.redos = [];
      this.bindEvents(); 
      this.clearCanvas();
    },
  }
  painter.init();
});

