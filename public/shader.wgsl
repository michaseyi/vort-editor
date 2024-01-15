// #import "specular"

struct VertexIn {
    @location(0) position: vec2<f32>,
    @location(1) color: vec3<f32>
}

struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec3<f32>
}

struct FragmentIn {
    @location(0) color: vec3<f32>
}

struct FragmentOut {
    @location(0) color: vec4<f32>
}


struct Transform {
    translation_matrix: mat4x4<f32>,
    rotation_matrix: mat4x4<f32>,
    scale_matrix: mat4x4<f32>,
    view_matrix: mat4x4<f32>,
    projection_matrix: mat4x4<f32>,
}

// @group(0) @binding(0) var <uniform> transform: Transform;

@group(0) @binding(0) var<uniform> time: f32;


@vertex
fn vs_main(input: VertexIn) -> VertexOut {
    let output = VertexOut(
        vec4<f32>(input.position, 0.0, 1.0),
        vec3<f32>(sin(time))
    );
    return output;
}

@fragment
fn fs_main(input: FragmentIn) -> FragmentOut {
    return FragmentOut(vec4<f32>(input.color, 1.0));
}
