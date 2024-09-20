/**
 * Draws a wireframe
 * @param {CanvasContext} ctx 
 * @param {array} proj_tris 
 */
function wireframe(ctx, proj_tris) {
    for (let i = 0; i < proj_tris.length; i++) {
        ctx.strokeStyle = "#f00";

        ctx.beginPath();
        ctx.moveTo(proj_tris[i][0][0], proj_tris[i][0][1]);
        ctx.lineTo(proj_tris[i][1][0], proj_tris[i][1][1]);
        ctx.lineTo(proj_tris[i][2][0], proj_tris[i][2][1]);
        ctx.lineTo(proj_tris[i][0][0], proj_tris[i][0][1]);
        ctx.stroke();
    }
}

/**
 * Loads a .obj file
 * @param {string} text 
 * @returns {array}
 */
function load_obj(text) {
    let v = [];
    let vt = [];
    let vn = [];
    let f0 = [];
    let f1 = [];
    let f2 = [];

    let lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].split(" ");

        switch (lines[i][0]) {
            case "v":
                lines[i].splice(0, 1);

                for (let j = 0; j < lines[i].length; j++) lines[i][j] = parseFloat(lines[i][j]);
                v.push(lines[i]);
                break;

            case "vt":
                lines[i].splice(0, 1);

                for (let j = 0; j < lines[i].length; j++) lines[i][j] = parseFloat(lines[i][j]);
                vt.push(lines[i]);
                break;

            case "f":
                lines[i].splice(0, 1);

                if (lines[i].length == 3) {
                    for (let j = 0; j < lines[i].length; j++) {
                        lines[i][j] = lines[i][j].split("/");

                        lines[i][j][0] = parseInt(lines[i][j][0]);
                        lines[i][j][1] = parseInt(lines[i][j][1]);
                        lines[i][j][2] = parseInt(lines[i][j][2]);
                    }

                    f0.push([lines[i][0][0], lines[i][1][0], lines[i][2][0]]);
                    if (lines[i][0][1]) f1.push([lines[i][0][1], lines[i][1][1], lines[i][2][1]]);
                    if (lines[i][0][2]) f2.push([lines[i][0][2], lines[i][1][2], lines[i][2][2]]);

                } else if (lines[i].length == 4) {
                    for (let j = 0; j < lines[i].length; j++) {
                        lines[i][j] = lines[i][j].split("/");

                        lines[i][j][0] = parseInt(lines[i][j][0]);
                        lines[i][j][1] = parseInt(lines[i][j][1]);
                        lines[i][j][2] = parseInt(lines[i][j][2]);
                    }

                    f0.push([lines[i][0][0], lines[i][1][0], lines[i][3][0]]);
                    f0.push([lines[i][1][0], lines[i][2][0], lines[i][3][0]]);

                    if (lines[i][0][1]){
                        f1.push([lines[i][0][1], lines[i][1][1], lines[i][3][1]]);
                        f1.push([lines[i][1][1], lines[i][2][1], lines[i][3][1]]);
                    }

                    if (lines[i][0][2]) {
                        f2.push([lines[i][0][2], lines[i][1][2], lines[i][3][2]]);
                        f2.push([lines[i][1][2], lines[i][2][2], lines[i][3][2]]);
                    }
                }
                break;
        }
    }

    let new_tris = [];
    for (let i = 0; i < f0.length; i++) {
        new_tris[i] = [];
        new_tris[i][0] = v[f0[i][0] - 1];
        new_tris[i][1] = v[f0[i][1] - 1];
        new_tris[i][2] = v[f0[i][2] - 1];
    }

    data = new_tris;
}

/**
 * Calculates the world matrix
 * @param {array} rot Rotation of scene
 * @param {array} trans Translation of scene
 * @returns {matrix}
 */
function calc_world_mat(rot, view_mat) {
    let world_mat = mat_math.make_identity();
    world_mat = mat_math.mult_mat(mat_math.rot_x(rot[0]), mat_math.rot_y(rot[1]));
    world_mat = mat_math.mult_mat(world_mat, mat_math.rot_z(rot[2]));

    return world_mat;
}

/**
 * Finds the area of a triangle
 * @param {array} points An array of points
 * @returns {integer} area
 */
function triangle_area(points) {
    return Math.abs(
        points[0][0] * (points[1][1] - points[2][1]) +
        points[1][0] * (points[2][1] - points[0][1]) +
        points[2][0] * (points[0][1] - points[1][1])
    ) / 2;
}

/**
 * Creates a buffer
 * @param {integer} r rows
 * @param {integer} c columns
 * @param {integer} init_val initial value
 * @returns {buffer}
 */
function create_buffer(r, c, init_val) {
    let buffer = [];

    for (let x = 0; x < r; x++) {
        buffer[x] = [];
        for (let y = 0; y < c; y++) {
            buffer[x][y] = init_val;
        }
    }

    return buffer;
}