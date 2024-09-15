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
let aspect_ratio = canvas.width / canvas.height;
let near_plane = 0.1;
let far_plane = 1000;
let fps = 5;

let proj_tris = [];

let world_mat = calc_world_mat([60, 30, 0]);
let proj_mat = mat_math.projection(fov, aspect_ratio, near_plane, far_plane);

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

function vertex_shader(i) {
    let tri = [];

    // Translate
    tri[0] = mat_math.mult_vec(world_mat, data[i][0]);
    tri[1] = mat_math.mult_vec(world_mat, data[i][1]);
    tri[2] = mat_math.mult_vec(world_mat, data[i][2]);

    tri[0][2] += 3;
    tri[1][2] += 3;
    tri[2][2] += 3;

    // 3d -> 2d
    tri[0] = mat_math.mult_vec(proj_mat, tri[0]);
    tri[1] = mat_math.mult_vec(proj_mat, tri[1]);
    tri[2] = mat_math.mult_vec(proj_mat, tri[2]);

    // Scale up points
    tri[0][0] = Math.round(tri[0][0] * 100 + canvas.width / 2);
    tri[1][0] = Math.round(tri[1][0] * 100 + canvas.width / 2);
    tri[2][0] = Math.round(tri[2][0] * 100 + canvas.width / 2);

    tri[0][1] = Math.round(tri[0][1] * 100 + canvas.height / 2);
    tri[1][1] = Math.round(tri[1][1] * 100 + canvas.height / 2);
    tri[2][1] = Math.round(tri[2][1] * 100 + canvas.height / 2);

    proj_tris.push(tri);
}

function fragment_shader(x, y) {
    
}