<script>
    import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

    let rendererElement;
    let created = false;

    export let fov = 45;

    export let scene = undefined;
    export let camera = undefined;
    export let renderer = undefined;

    const createRenderer = () => {
        created = true;

        scene = new Scene();
        camera = new PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);

        scene.add(camera);

        renderer = new WebGLRenderer({ antialias: true, });
        renderer.setSize(window.innerWidth, window.innerHeight);
        rendererElement.appendChild(renderer.domElement);
    };

    window.addEventListener('resize', () => {
        if (!rendererElement) return;
        camera.aspect = rendererElement.clientWidth / rendererElement.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(rendererElement.clientWidth, rendererElement.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
    });

    $: rendererElement && !created && createRenderer();
</script>

<div class="renderer" bind:this={rendererElement}></div>

<style>
    .renderer {
        width: 100vw;
        height: 100vh;
    }
</style>

