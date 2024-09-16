/**
 * Draw a wireframe
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
 * 
 * @param {string} text 
 * @returns {array}
 */
function load_obj(text) {
    let verts = [];
    let faces = [];

    let lines = text.split("\n");
    for(let i = 0; i < lines.length; i++){
        switch(lines[i][0]){
            case "v":
                let vert = lines[i].split(" ");
                vert.splice(0, 1);

                for(let j = 0; j < vert.length; j++) vert[j] = parseFloat(vert[j]);
                verts.push(vert);
                break;
            
            case "f":
                let face = lines[i].split(" ");
                face.splice(0, 1);

                for(let j = 0; j < face.length; j++) face[j] = parseInt(face[j]);
                faces.push(face);
                break;
        }
    }

    let new_tris = [];
    for(let i = 0; i < faces.length; i++){
        new_tris[i] = [];
        new_tris[i][0] = verts[faces[i][0] - 1];
        new_tris[i][1] = verts[faces[i][1] - 1];
        new_tris[i][2] = verts[faces[i][2] - 1];
    }

    data = new_tris;
}

/**
 * Calculates the world matrix
 * @param {array} rot Rotation of scene
 * @param {array} trans Translation of scene
 * @returns {matrix}
 */
function calc_world_mat(rot) {
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

    for(let x = 0; x < r; x++){
        buffer[x] = [];
        for(let y = 0; y < c; y++){
            buffer[x][y] = init_val;
        }
    }

    return buffer;
}