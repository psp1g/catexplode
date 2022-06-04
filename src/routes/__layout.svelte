<script>
    import { base } from '$app/paths';
</script>

<slot />

<div class="overlays">
    <a class="steam" href="https://steamcommunity.com/groups/catexplode">
        <img src="{base}/platforms/steam.svg" alt="steam" class="icon" />
        Steam Group
    </a>
    <a class="discord" href="https://discord.gg/psp">
        <img src="{base}/platforms/discord.svg" alt="discord" class="icon" />
        PSP Discord
    </a>
    <a class="twitch" href="https://twitch.tv/psp1g">
        <img src="{base}/platforms/twitch.svg" alt="twitch" class="icon" />
        PSP Twitch
    </a>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background: black;
        -webkit-font-smoothing: antialiased;
    }
    .overlays {
        position: absolute;
        left: 5px;
        bottom: 30px;
        display: flex;
        flex-direction: column;
        z-index: 10;
    }
    .overlays a {
        padding: 6px 30px;
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0.6;
        color: lightgrey;
        font-family: Arial, serif;
        font-size: 16px;
        text-decoration: none;
    }
    .overlays a:hover {
        opacity: 0.9;
    }
    .icon {
        width: 20px;
        aspect-ratio: 1 / 1;
    }
</style>