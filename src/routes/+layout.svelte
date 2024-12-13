<script>
	import '../app.css';
	import { AppShell } from '@skeletonlabs/skeleton';
	import Header from '../components/Header.svelte';
	import Navigator from '../components/Navigator.svelte';

	let { children } = $props();
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-20 p-4">
    <div class="flex size-full min-h-screen flex-col" data-theme="skeleton">
        <Header />
        <div class="flex size-full">
            <div class="bg-surface-500/5 w-20">
                <Navigator />
            </div>
            <main class="flex-1 overflow-y-auto p-4 pt-14">
				{@render children()}
            </main>
        </div>
    </div>
</AppShell>
