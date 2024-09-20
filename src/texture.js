class Texture {
    constructor(src){
        this.src = src;
    }

    async initialize() {
        return new Promise((resolve) => {
            this.image = new Image();
            this.image.src = this.src;
    
            this.image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = this.image.width;
                canvas.height = this.image.height;
        
                const ctx = canvas.getContext("2d");
                ctx.drawImage(this.image, 0, 0);
                this.data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

                resolve();
            };
        });
    }

    get_pixel(x, y) {
        return [
            this.data[((this.image.width * y) + x) * 4],
            this.data[((this.image.width * y) + x) * 4 + 1],
            this.data[((this.image.width * y) + x) * 4 + 2],
            this.data[((this.image.width * y) + x) * 4 + 3]
        ];
    }
}