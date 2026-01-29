<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    onMount(() => {
        goto('/playground');
    });
</script>

<div class="redirect">
    Redirecting to <a href="/playground">Playground</a>...
</div>

<style>
    .redirect {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: sans-serif;
    }
</style>
