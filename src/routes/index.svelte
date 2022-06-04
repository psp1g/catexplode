<script>
    import { onMount, onDestroy } from 'svelte';
    import Renderer from '$lib/components/Renderer.svelte';
    import { base } from '$app/paths';
    import Stats from 'three/examples/jsm/libs/stats.module.js';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import {
        HemisphereLight, PlaneGeometry, MeshBasicMaterial, Mesh, Vector3, Clock, Group,
        VideoTexture, Color, DoubleSide, RGBAFormat, NearestFilter,
    } from 'three';

    let video, scene, camera, renderer, stats, controls, mesh;
    let rendered = false;
    let rendering = false;
    let startAnim = false;
    let anim_rotations = 0;

    const meshes = [];
    const meshes_rates = new Map();

    const ROTATE_AMT = 2;
    const ANIM_DURATION_SECONDS = 0.8;

    const MESHES_CT = 250; // amount of catexplode rain meshes
    const MESHES_RAIN_RATE_LOW = 5;
    const MESHES_RAIN_RATE_HIGH = 15;

    const clock = new Clock();

    const tick = () => {
        const delta = clock.getDelta();

        // Starting spinning animation
        if (startAnim && mesh) {
            const rotations = ROTATE_AMT * Math.PI;
            const rotation_per_second = ROTATE_AMT / ANIM_DURATION_SECONDS;
            let rotation_frame = rotation_per_second * delta;

            // End of animation
            if (anim_rotations + rotation_frame > rotations) {
                rotation_frame = anim_rotations - rotations;
                startAnim = false;
            }

            anim_rotations += rotation_frame;
            mesh.rotateY(rotation_frame);
        }

        // catexplode rain
        for (let i = 0; i < meshes.length; i++) {
            const rmesh = meshes[i];

            // Reset falling catexplode rain that are out of bounds
            if (rmesh.position.y < -20) {
                const x = (Math.random() * 50) - 25;
                const z = (Math.random() * 50) - 25;

                rmesh.position.set(x, 20, z);
                meshes_rates.set(i, MESHES_RAIN_RATE_LOW + (Math.random() * MESHES_RAIN_RATE_HIGH));
            }

            const rate = meshes_rates.get(i) || 0;
            rmesh.position.y -= rate * delta; // raining
        }

        controls.update();
        stats.update();
        video.play();
        renderer.render(scene, camera);
    };

    const setupRender = async () => {
        rendered = true;
        startAnim = true;
        anim_rotations = 0;

        stats = new Stats();
        controls = new OrbitControls(camera, renderer.domElement);

        const ambientLight = new HemisphereLight(
            'white',
            'darkslategrey',
            1.5,
        );

        scene.add(ambientLight);

        camera.position.set(3.5, 0, 0);
        camera.rotation.setFromVector3(new Vector3(0, 0, 0))
        scene.background = new Color('black');

        const texture = new VideoTexture(video);
        texture.format = RGBAFormat;
        texture.minFilter = NearestFilter;
        texture.maxFilter = NearestFilter;
        texture.generateMipmaps = false;

        const mat = new MeshBasicMaterial({ map: texture, transparent: true });
        mat.side = DoubleSide;

        const group = new Group();

        // Main catexplode
        const main_geo = new PlaneGeometry(1, 1, 1, 1);

        mesh = new Mesh(main_geo, mat);
        mesh.rotateY(Math.PI / 2);
        group.add(mesh);

        const geo = new PlaneGeometry(0.4, 0.4, 1, 1); // rain geometry

        // rain catexplode
        for (let i = 0; i < MESHES_CT; i++) {
            const rmesh = new Mesh(geo, mat);
            rmesh.rotateY(Math.PI / 2);
            rmesh.position.set(0, -80, 0);
            group.add(rmesh);
            meshes.push(rmesh);
        }

        scene.add(group);

        renderer.setAnimationLoop(tick);
    };

    const stopRender = () => {
        renderer.setAnimationLoop(null);
        rendered = false;
        rendering = false;
    };

    onMount(() => rendering = true);
    onDestroy(() => rendering = false);

    $: rendering && !rendered && renderer && scene && camera && setupRender();
    $: !rendering && rendered && stopRender();
</script>

<a href="https://steamcommunity.com/groups/catexplode">
    <video bind:this={video} src="{base}/catexplode.webm"></video>
</a>
<Renderer bind:scene bind:camera bind:renderer />

<style>
    a {
        position: absolute;
        z-index: -10;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        width: 200px;
        aspect-ratio: 1 / 1;
    }
    video {
        width: 100%;
        height: 100%;
    }
</style>