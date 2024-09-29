const canvas = document.querySelector("#c");
const ctx = canvas.getContext("2d");

canvas.width = 512;
canvas.height = 512;

let data = [];

let fov = 90;
let aspectRatio = canvas.width / canvas.height;
let near_plane = 0.1;
let far_plane = 1000;
let fps = 5;
let draw_wireframe = false;

let proj_tris = [];

let world_mat = calc_world_mat([60, 30, 0]);
let proj_mat = mat_math.projection(fov, aspectRatio, near_plane, far_plane);

render_loop();
function render_loop() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < data.length; i++) {
        vertex_shader(i);
    }

    for (let i = 0; i < proj_tris.length; i++) draw_triangle(proj_tris[i], ctx);

    if(draw_wireframe) wireframe(ctx, proj_tris);
    proj_tris = [];

    setTimeout(() => {
        render_loop();
    }, 1000 / fps);
}

function vertex_shader(i) {

    // Model Space -> World Space
    let proj_tri = [];
    proj_tri[0] = mat_math.mult_vec(world_mat, data[i][0]);
    proj_tri[1] = mat_math.mult_vec(world_mat, data[i][1]);
    proj_tri[2] = mat_math.mult_vec(world_mat, data[i][2]);

    proj_tri[0][2] += 8;
    proj_tri[1][2] += 8;
    proj_tri[2][2] += 8;

    // 3d -> 2d
    proj_tri[0] = mat_math.mult_vec(proj_mat, proj_tri[0]);
    proj_tri[1] = mat_math.mult_vec(proj_mat, proj_tri[1]);
    proj_tri[2] = mat_math.mult_vec(proj_mat, proj_tri[2]);

    // Scale up points
    proj_tri[0][0] = Math.round(proj_tri[0][0] * 100 + canvas.width / 2);
    proj_tri[1][0] = Math.round(proj_tri[1][0] * 100 + canvas.width / 2);
    proj_tri[2][0] = Math.round(proj_tri[2][0] * 100 + canvas.width / 2);

    proj_tri[0][1] = Math.round(proj_tri[0][1] * 100 + canvas.height / 2);
    proj_tri[1][1] = Math.round(proj_tri[1][1] * 100 + canvas.height / 2);
    proj_tri[2][1] = Math.round(proj_tri[2][1] * 100 + canvas.height / 2);

    proj_tris.push(proj_tri);
}

function fragment_shader(x, y) {

}