<script>
    import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
</script>

<AppBar>
    <svelte:fragment slot="lead" >
        <a href="/" class="font-bold">
            simple to-do
        </a> 
    </svelte:fragment>
	<svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
</AppBar>
