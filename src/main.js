const canvas = document.querySelector("#c");
const ctx = canvas.getContext("2d");

canvas.width = 512;
canvas.height = 512;

let fov = 90;
let aspect_ratio = canvas.width / canvas.height;
let near_plane = 0.1;
let far_plane = 1000;
let light_dir = vec_math.norm([0, -1, -1]);
let fps = 1;

let data = [];
let proj_tris = [];
let tri_colors = [];
let depth_buffer = create_buffer(canvas.width, canvas.height, Infinity);

let world_mat = calc_world_mat([60, 0, 0]);
let proj_mat = mat_math.projection(fov, aspect_ratio, near_plane, far_plane);

render_loop();
function render_loop() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < data.length; i++) {
        vertex_shader(i);
    }

    for (let i = 0; i < proj_tris.length; i++) {

        // Loop over pixels inside bounding box
        let all_x = [proj_tris[i][0][0], proj_tris[i][1][0], proj_tris[i][2][0]];
        let all_y = [proj_tris[i][0][1], proj_tris[i][1][1], proj_tris[i][2][1]];

        let x_min = Math.min(...all_x);
        let y_min = Math.min(...all_y);

        let x_max = Math.max(...all_x);
        let y_max = Math.max(...all_y);

        let area = triangle_area(proj_tris[i]);

        for (let x = x_min; x < x_max; x++) {
            for (let y = y_min; y < y_max; y++) {

                // Check if pixel is inside the triangle
                let sum = 0;

                sum += triangle_area([
                    [x, y],
                    proj_tris[i][1],
                    proj_tris[i][2]
                ]);

                sum += triangle_area([
                    proj_tris[i][0],
                    [x, y],
                    proj_tris[i][2]
                ]);

                sum += triangle_area([
                    proj_tris[i][0],
                    proj_tris[i][1],
                    [x, y],
                ]);

                if(sum <= area) fragment_shader(i, x, y);
            }
        }
    }

    // wireframe(ctx, proj_tris);
    proj_tris = [];
    tri_colors = [];
    depth_buffer = create_buffer(canvas.width, canvas.height, Infinity);

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

    tri[0][2] += 7;
    tri[1][2] += 7;
    tri[2][2] += 7;

    // Lighting
    let line1 = vec_math.sub(tri[1], tri[0]);
    let line2 = vec_math.sub(tri[2], tri[0]);
    let norm = vec_math.norm(vec_math.cp(line1, line2));
    let shadow = Math.max(0.1, vec_math.dp(light_dir, norm));
    tri_colors.push(shadow);

    // 3d -> 2d
    let depth = [tri[0][2], tri[1][2], tri[2][2]];

    tri[0] = mat_math.mult_vec(proj_mat, tri[0]);
    tri[1] = mat_math.mult_vec(proj_mat, tri[1]);
    tri[2] = mat_math.mult_vec(proj_mat, tri[2]);

    tri[0][2] = depth[0];
    tri[1][2] = depth[1];
    tri[2][2] = depth[2];

    // Scale up points
    tri[0][0] = Math.round(tri[0][0] * 100 + canvas.width / 2);
    tri[1][0] = Math.round(tri[1][0] * 100 + canvas.width / 2);
    tri[2][0] = Math.round(tri[2][0] * 100 + canvas.width / 2);

    tri[0][1] = Math.round(tri[0][1] * 100 + canvas.height / 2);
    tri[1][1] = Math.round(tri[1][1] * 100 + canvas.height / 2);
    tri[2][1] = Math.round(tri[2][1] * 100 + canvas.height / 2);

    proj_tris.push(tri);
}

function fragment_shader(i, x, y) {

    // Find depth of pixel
    let x1 = proj_tris[i][0][0];
    let x2 = proj_tris[i][1][0];
    let x3 = proj_tris[i][2][0];

    let y1 = proj_tris[i][0][1];
    let y2 = proj_tris[i][1][1];
    let y3 = proj_tris[i][2][1];

    let z1 = proj_tris[i][0][2];
    let z2 = proj_tris[i][1][2];
    let z3 = proj_tris[i][2][2];

    let z = (
        z3 * (x - x1) * (y - y2) +
        z1 * (x - x2) * (y - y3) +
        z2 * (x - x3) * (y - y1) -
        z2 * (x - x1) * (y - y3) -
        z3 * (x - x2) * (y - y1) -
        z1 * (x - x3) * (y - y2)
    ) /
    (
        (x - x1) * (y - y2) +
        (x - x2) * (y - y3) +
        (x - x3) * (y - y1) -
        (x - x1) * (y - y3) -
        (x - x2) * (y - y1) -
        (x - x3) * (y - y2)
    );

    // Color the pixel
    if(depth_buffer[x][y] > z){
        ctx.fillStyle = `rgb(${Math.round(tri_colors[i] * 256)}, ${Math.round(tri_colors[i] * 256)}, ${Math.round(tri_colors[i] * 256)})`;
        ctx.fillRect(x, y, 1, 1);
        depth_buffer[x][y] = z;
    }
}