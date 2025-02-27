class MyImage extends Shape {
   constructor(img, options) {
      super(options);
      this.img = img;

      this.size = { width: img.width, height: img.height };

      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = img.width;
      tmpCanvas.height = img.height;
      const tmpCtx = tmpCanvas.getContext("2d");
      tmpCtx.drawImage(img, 0, 0);
      this.base64 = tmpCanvas.toDataURL();
   }

   static load(data, stageProperties) {
      const myImage = new MyImage(new Image());
      myImage.id = data.id;
      myImage.img.src = data.base64;
      myImage.base64 = data.base64;
      myImage.options = JSON.parse(JSON.stringify(data.options));
      myImage.center = Vector.load(data.center);
      myImage.center.x += stageProperties.left;
      myImage.center.y += stageProperties.top;
      myImage.size = data.size;
      myImage.selected = data.selected;
      return myImage;
   }

   serialize() {
      return {
         type: "MyImage",
         id: this.id,
         options: JSON.parse(JSON.stringify(this.options)),
         center: new Vector(
            this.center.x - stageProperties.left,
            this.center.y - stageProperties.top
         ),
         size: this.size,
         base64: this.base64,
         selected: this.selected,
      };
   }

   getPoints() {
      return [
         new Vector(-this.size.width / 2, -this.size.height / 2),
         new Vector(-this.size.width / 2, this.size.height / 2),
         new Vector(this.size.width / 2, this.size.height / 2),
         new Vector(this.size.width / 2, -this.size.height / 2),
      ];
   }

   setWidth(width) {
      this.size.width = width;
   }

   setHeight(height) {
      this.size.height = height;
   }

   draw(ctx, hitRegion = false) {
      const center = this.center ? this.center : { x: 0, y: 0 };
      let left, top, width, height;

      left = center.x - this.size.width / 2;
      top = center.y - this.size.height / 2;
      width = this.size.width;
      height = this.size.height;

      if (hitRegion) {
         ctx.beginPath();
         ctx.rect(left, top, width, height);
         this.applyHitRegionStyles(ctx);
      } else {
         ctx.save();
         ctx.translate(center.x, center.y);
         ctx.scale(Math.sign(width), Math.sign(height));
         ctx.beginPath();
         ctx.drawImage(this.img, -width / 2, -height / 2, width, height);
         this.applyStyles(ctx);
         ctx.restore();
      }
   }
}
