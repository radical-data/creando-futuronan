<script lang="ts">
  export let openCall: {
    isOpen: boolean;
    title: string;
    deadlineISO?: string;
    applyLinks?: { label: string; href: string }[];
  };
  export let events: {
    title: string;
    dateISO: string;
    island: string;
    href: string;
  }[] = [];
  const fmt = (iso: string, locale = "en-AW") =>
    new Date(iso).toLocaleString(locale, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
</script>

<section class="py-10 lg:py-14 border-t border-black/10">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    {#if openCall?.isOpen}
      <div class="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <div class="text-xs uppercase tracking-wide text-black/60">
          Open call
        </div>
        <h2 class="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
          {openCall.title}
        </h2>
        {#if openCall.deadlineISO}
          <p class="mt-2 text-black/75">
            Deadline: {fmt(openCall.deadlineISO)}
          </p>
        {/if}
        <div class="mt-4 flex flex-wrap gap-3">
          {#each openCall.applyLinks ?? [] as link}
            <a
              class="inline-flex items-center rounded-full bg-black text-white px-5 py-3 text-sm hover:bg-black/90"
              href={link.href}
            >
              {link.label}
            </a>
          {/each}
          <a
            href="/sustain#faq"
            class="inline-flex items-center rounded-full border border-black px-5 py-3 text-sm hover:bg-black hover:text-white"
            >FAQs</a
          >
        </div>
      </div>
    {:else}
      <div class="flex items-center justify-between">
        <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight">
          Upcoming workshops & events
        </h2>
        <!-- if you add a /calendar later, reveal this -->
        <!-- <a href="/calendar" class="text-sm hover:underline">See all →</a> -->
      </div>
      <div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each events.slice(0, 6) as e}
          <a
            href={e.href}
            class="rounded-2xl border border-black/10 bg-white p-5 hover:bg-black/5"
          >
            <div class="text-xs uppercase tracking-wide text-black/60">
              {e.island}
            </div>
            <div class="mt-1 font-semibold">{e.title}</div>
            <div class="mt-1 text-sm text-black/70">{fmt(e.dateISO)}</div>
            <div class="mt-3 text-sm font-medium">Details →</div>
          </a>
        {/each}
        {#if events.length === 0}
          <div
            class="rounded-2xl border border-black/10 bg-white p-5 text-black/70"
          >
            No events scheduled yet — check back soon.
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>
