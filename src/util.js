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