const canvas = document.querySelector("#c");
const ctx = canvas.getContext("2d");

canvas.width = 512;
canvas.height = 512;

let data = [
    [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0]
    ]
];

let fov = 90;
let aspectRatio = 1;
let near_plane = 0.1;
let far_plane = 1000;
let fps = 5;

let proj_tris = [];
let proj_mat = mat_math.projection(fov, aspectRatio, near_plane, far_plane);

render_loop();
function render_loop() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < data.length; i++){
        vertex_shader(i);
    }

    for(let x = 0; x < canvas.width; x++){
        for(let y = 0; y < canvas.height; y++){
            fragment_shader(x, y);
        }
    }

    wireframe(ctx, proj_tris);
    proj_tris = [];

    setTimeout(() => {
        render_loop();
    }, 1000 / fps);
}

/**
 * Converts 3d points to 2d points
 * @param {integer} i
 */
function vertex_shader(i) {
    // Convert 3d to 2d
    let proj_tri = [];
    proj_tri[0] = mat_math.mult_vec(proj_mat, data[i][0]);
    proj_tri[1] = mat_math.mult_vec(proj_mat, data[i][1]);
    proj_tri[2] = mat_math.mult_vec(proj_mat, data[i][2]);

    // Scale up points
    proj_tri[0][0] = Math.round(proj_tri[0][0] * 100 + canvas.width / 2);
    proj_tri[1][0] = Math.round(proj_tri[1][0] * 100 + canvas.width / 2);
    proj_tri[2][0] = Math.round(proj_tri[2][0] * 100 + canvas.width / 2);

    proj_tri[0][1] = Math.round(proj_tri[0][1] * 100 + canvas.height / 2);
    proj_tri[1][1] = Math.round(proj_tri[1][1] * 100 + canvas.height / 2);
    proj_tri[2][1] = Math.round(proj_tri[2][1] * 100 + canvas.height / 2);

    proj_tris.push(proj_tri);
}

/**
 * Draws pixels with rasterization & interpolation
 * @param {integer} x 
 * @param {integer} y 
 */
function fragment_shader(x, y) {

}