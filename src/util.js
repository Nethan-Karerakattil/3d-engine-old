/**
 * Draw a wireframe
 * @param {CanvasContext} ctx 
 * @param {array} proj_tris 
 */
function wireframe(ctx, proj_tris) {
    for (let i = 0; i < proj_tris.length; i++) {
        ctx.strokeStyle = "#fff";

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

                    if (lines[i][0][1]) {
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
 * @param {vector} rot rotation of scene
 * @returns {matrix}
 */
function calc_world_mat(rot) {
    let world_mat = mat_math.make_identity();
    world_mat = mat_math.mult_mat(mat_math.rot_x(rot[0]), mat_math.rot_y(rot[1]));
    world_mat = mat_math.mult_mat(world_mat, mat_math.rot_z(rot[2]));
    return world_mat;
}

function draw_triangle(tri, ctx) {
    ctx.fillStyle = "rgb(255, 255, 255)";

    let x1 = tri[0][0];
    let x2 = tri[1][0];
    let x3 = tri[2][0];

    let y1 = tri[0][1];
    let y2 = tri[1][1];
    let y3 = tri[2][1];

    let z1 = tri[0][2];
    let z2 = tri[1][2];
    let z3 = tri[2][2];

    if (y2 < y1) {
        [x1, x2] = swap(x1, x2);
        [y1, y2] = swap(y1, y2);
    }

    if (y3 < y1) {
        [x1, x3] = swap(x1, x3);
        [y1, y3] = swap(y1, y3);
    }

    if (y3 < y2) {
        [x2, x3] = swap(x2, x3);
        [y2, y3] = swap(y2, y3);
    }

    let dx1 = x2 - x1;
    let dy1 = y2 - y1;
    let dx2 = x3 - x1;
    let dy2 = y3 - y1;

    let dax_step = 0;
    let dbx_step = 0;

    if (dy1) dax_step = dx1 / Math.abs(dy1);
    if (dy2) dbx_step = dx2 / Math.abs(dy2);

    if (dy1) {
        for (let i = y1; i <= y2; i++) {
            let ax = x1 + (i - y1) * dax_step;
            let bx = x1 + (i - y1) * dbx_step;

            if (ax > bx) [ax, bx] = swap(ax, bx);
            for (let j = ax; j < bx; j++) ctx.fillRect(j, i, 1, 1);
        }
    }

    dy1 = y3 - y2;
    dx1 = x3 - x2;

    if (dy1) dax_step = dx1 / Math.abs(dy1);
    if (dy2) dbx_step = dx2 / Math.abs(dy2);

    if (dy1) {
        for (let i = y2; i <= y3; i++) {
            let ax = x2 + (i - y2) * dax_step;
            let bx = x1 + (i - y1) * dbx_step;

            if (ax > bx) [ax, bx] = swap(ax, bx);
            for (let j = ax; j < bx; j++) ctx.fillRect(j, i, 1, 1);
        }
    }
}

function swap(v1, v2) {
    return [v2, v1];
}