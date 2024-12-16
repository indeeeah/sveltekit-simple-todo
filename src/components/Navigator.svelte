<script>
    import HomeIcon from '$lib/icons/HomeIcon.svelte';
    import ListIcon from '$lib/icons/ListIcon.svelte';
    import { today } from '@internationalized/date';
    import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
    import { page } from '$app/stores';

    let now = today('Asia/Seoul');
    let currentTile = 0;
    let navItems = [
        { name: "Home", href: "/", icon: HomeIcon },
        { name: "To-do", href: "/to-do/:date", icon: ListIcon },
        { name: "Playground", href: "/playground" }
    ];

    function isSelected(href) {
        if (href === "/") {
            return $page.url.pathname === href;
        }
        if (href.startsWith("/to-do/:date")) {
            return $page.url.pathname.startsWith("/to-do/");
        }
        return false;
    }

    const formattedNow = now.toString();
</script>

<AppRail>
    {#each navItems as item}
        <AppRailAnchor
            bind:group={currentTile}
            name={item.name}
            title={item.name}
            selected={isSelected(item.href)}
            href={item.href.replace(":date", formattedNow)}>
            <svelte:fragment slot="lead">
                <svelte:component this={item.icon} />
            </svelte:fragment>
            <span>{item.name}</span>
        </AppRailAnchor>
    {/each}
</AppRail>