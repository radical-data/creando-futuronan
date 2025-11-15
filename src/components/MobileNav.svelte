<script lang="ts">
  import { languages, type Lang } from "../i18n/ui";
  import { getRelativeLocaleUrl } from "astro:i18n";
  import { onMount } from "svelte";

  interface Props {
    lang: Lang;
    currentPath: string;
    navItems: {
      spark: string;
      sustain: string;
      about: string;
    };
  }

  let { lang: currentLang, currentPath, navItems }: Props = $props();

  let isOpen = $state(false);

  // Get the page ID from the current path
  const path = currentPath.replace(/^\/(en|nl|pap)(\/|$)/, "/");
  const pageId = path === "/" ? "" : path.replace(/^\/|\/$/g, "");

  function urlForLocale(target: Lang) {
    return getRelativeLocaleUrl(target, pageId);
  }

  function toggleMenu() {
    isOpen = !isOpen;
    // Prevent body scroll when menu is open
    if (typeof document !== "undefined") {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }

  function closeMenu() {
    isOpen = false;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }

  // Close menu when clicking outside
  onMount(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest(".mobile-nav")) {
        closeMenu();
      }
    }
    if (typeof document !== "undefined") {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  });

  // Close menu on escape key
  onMount(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        closeMenu();
      }
    }
    if (typeof document !== "undefined") {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  });
</script>

<div class="mobile-nav sm:hidden">
  <!-- Hamburger Button -->
  <button
    type="button"
    onclick={toggleMenu}
    class="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    aria-label="Toggle menu"
    aria-expanded={isOpen}
  >
    <svg
      class="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {#if isOpen}
        <!-- X icon when open -->
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      {:else}
        <!-- Hamburger icon when closed -->
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      {/if}
    </svg>
  </button>

  <!-- Overlay -->
  {#if isOpen}
    <div
      class="fixed inset-0 bg-black/50 z-40"
      onclick={closeMenu}
      aria-hidden="true"
    ></div>
  {/if}

  <!-- Menu Panel -->
  <div
    class={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? "translate-x-0" : "translate-x-full"
    }`}
    role="dialog"
    aria-modal="true"
    aria-label="Navigation menu"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold">Menu</h2>
        <button
          type="button"
          onclick={closeMenu}
          class="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Close menu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Navigation Items -->
      <nav class="flex-1 overflow-y-auto p-6 space-y-4">
        <a
          href="/spark"
          onclick={closeMenu}
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 focus-ring focus-ring-spark group"
        >
          <span class="stream-indicator stream-indicator-spark flex-shrink-0"></span>
          <span class="font-medium">{navItems.spark}</span>
        </a>

        <a
          href="/sustain"
          onclick={closeMenu}
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 focus-ring focus-ring-sustain group"
        >
          <span class="stream-indicator stream-indicator-sustain flex-shrink-0"></span>
          <span class="font-medium">{navItems.sustain}</span>
        </a>

        <a
          href="/about"
          onclick={closeMenu}
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 focus-ring group"
        >
          <span class="font-medium">{navItems.about}</span>
        </a>
      </nav>

      <!-- Language Switcher -->
      <div class="p-6 border-t border-gray-200">
        <div class="space-y-2">
          <div class="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Language
          </div>
          {#each Object.entries(languages) as [code, label]}
            {@const isActive = code === currentLang}
            <a
              href={urlForLocale(code as Lang)}
              onclick={closeMenu}
              class={`block p-2 rounded-lg text-sm ${
                isActive
                  ? "font-bold bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span class="uppercase tracking-wide text-xs text-gray-500 mr-2">
                {code.toUpperCase()}
              </span>
              {label}
            </a>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

