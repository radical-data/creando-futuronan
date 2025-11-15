<script lang="ts">
  import { languages, type Lang } from "../i18n/ui";
  import { getRelativeLocaleUrl } from "astro:i18n";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu";

  interface Props {
    lang: Lang;
    currentPath: string;
  }

  let { lang: currentLang, currentPath }: Props = $props();

  // Get the page ID from the current path
  const path = currentPath.replace(/^\/(en|nl|pap)(\/|$)/, "/");
  const pageId = path === "/" ? "" : path.replace(/^\/|\/$/g, "");

  function urlForLocale(target: Lang) {
    return getRelativeLocaleUrl(target, pageId);
  }

  const currentLanguageCode = currentLang.toUpperCase();
</script>

<!-- Desktop: Full language switcher -->
<div class="hidden sm:flex items-center gap-2" aria-label="Choose language">
  {#each Object.entries(languages) as [code, label]}
    {@const isActive = code === currentLang}
    <a
      href={urlForLocale(code as Lang)}
      class={`text-xs uppercase tracking-wide ${
        isActive ? "font-bold underline" : "opacity-70 hover:opacity-100"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </a>
  {/each}
</div>

<!-- Mobile: Compact dropdown -->
<div class="sm:hidden">
  <DropdownMenu>
    <DropdownMenuTrigger
      class="text-xs uppercase tracking-wide font-bold px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label="Choose language"
    >
      {currentLanguageCode}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-[120px]">
      {#each Object.entries(languages) as [code, label]}
        {@const isActive = code === currentLang}
        <DropdownMenuItem asChild let:builder>
          <a
            {...builder}
            href={urlForLocale(code as Lang)}
            class={isActive ? "font-bold" : ""}
            aria-current={isActive ? "page" : undefined}
          >
            <span class="text-xs uppercase tracking-wide mr-2">{code.toUpperCase()}</span>
            {label}
          </a>
        </DropdownMenuItem>
      {/each}
    </DropdownMenuContent>
  </DropdownMenu>
</div>

