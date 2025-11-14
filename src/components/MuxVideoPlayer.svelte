<script lang="ts">
  let {
    playbackId,
    poster = '',
    autoplay = true,
    muted = true,
    loop = true,
    playsinline = true,
    className = '',
    lang = 'pap' as 'pap' | 'en' | 'nl',
  } = $props();
  
  const labels = {
    pap: { unavailable: "Video no ta disponibel" },
    en: { unavailable: "Video unavailable" },
    nl: { unavailable: "Video niet beschikbaar" },
  };
  
  const l = $derived(labels[lang] ?? labels.pap);
  
  let videoElement: HTMLVideoElement | null = null;
  let isLoading = $state(true);
  let hasError = $state(false);
  let isInitialized = $state(false);
  
  function initVideo() {
    if (!videoElement || !playbackId || isInitialized) return;
    
    isInitialized = true;
    
    // Mux HLS stream URL
    const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`;
    
    // Check if browser supports HLS natively (Safari)
    if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      videoElement.src = streamUrl;
      videoElement.addEventListener('loadeddata', () => {
        isLoading = false;
      }, { once: true });
      videoElement.addEventListener('error', () => {
        hasError = true;
        isLoading = false;
      }, { once: true });
    } else {
      // Need HLS.js for other browsers
      const loadHls = () => {
        if (typeof window === 'undefined' || !videoElement) return;
        
        const Hls = (window as any).Hls;
        if (Hls && Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
          });
          
          hls.loadSource(streamUrl);
          hls.attachMedia(videoElement!);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            isLoading = false;
          });
          
          hls.on(Hls.Events.ERROR, (event: any, data: any) => {
            console.error('HLS error:', data);
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  hasError = true;
                  isLoading = false;
                  hls.destroy();
                  break;
              }
            }
          });
        } else {
          hasError = true;
          isLoading = false;
        }
      };
      
      // Check if HLS.js is already loaded
      if (typeof window !== 'undefined' && (window as any).Hls) {
        loadHls();
      } else {
        // Load HLS.js dynamically
        const existingScript = document.querySelector('script[src*="hls.js"]');
        if (existingScript) {
          // Script already exists, wait for it to load
          existingScript.addEventListener('load', loadHls);
        } else {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js';
          script.onload = loadHls;
          script.onerror = () => {
            hasError = true;
            isLoading = false;
          };
          document.head.appendChild(script);
        }
      }
      
      // Handle video events
      videoElement.addEventListener('error', () => {
        hasError = true;
        isLoading = false;
      }, { once: true });
    }
  }
  
  // Reactive effect to initialize when element is bound
  $effect(() => {
    if (videoElement && playbackId && !isInitialized) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        initVideo();
      });
    }
  });
</script>

<div class="relative w-full h-full">
  {#if isLoading}
    <div class="absolute inset-0 flex items-center justify-center bg-gray-100">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
    </div>
  {/if}
  
  {#if hasError}
    <div class="absolute inset-0 flex items-center justify-center bg-gray-100">
      <div class="text-center text-gray-600">
        <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <p class="text-sm">{l.unavailable}</p>
      </div>
    </div>
  {/if}
  
  <video
    bind:this={videoElement}
    {poster}
    {autoplay}
    {muted}
    {loop}
    {playsinline}
    class="w-full h-full object-cover {className}"
    style="opacity: {isLoading || hasError ? '0' : '1'}; transition: opacity 0.3s ease;"
  >
    <!-- Fallback content for browsers that don't support video -->
    <slot name="fallback" />
  </video>
</div>
