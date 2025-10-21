<script lang="ts">
  import { onMount } from 'svelte';
  
  export let playbackId: string;
  export let poster: string = '';
  export let autoplay: boolean = true;
  export let muted: boolean = true;
  export let loop: boolean = true;
  export let playsinline: boolean = true;
  export let className: string = '';
  
  let videoElement: HTMLVideoElement;
  let isLoading = true;
  let hasError = false;
  
  onMount(() => {
    if (videoElement) {
      // Mux HLS stream URL
      const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`;
      
      // Check if browser supports HLS
      if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoElement.src = streamUrl;
      } else if (typeof window !== 'undefined' && (window as any).Hls) {
        // HLS.js for other browsers
        const hls = new (window as any).Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoElement);
        
        hls.on((window as any).Hls.Events.MANIFEST_PARSED, () => {
          isLoading = false;
        });
        
        hls.on((window as any).Hls.Events.ERROR, (event: any, data: any) => {
          console.error('HLS error:', data);
          hasError = true;
          isLoading = false;
        });
      } else {
        // Fallback: try to load HLS.js dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
        script.onload = () => {
          const hls = new (window as any).Hls();
          hls.loadSource(streamUrl);
          hls.attachMedia(videoElement);
          
          hls.on((window as any).Hls.Events.MANIFEST_PARSED, () => {
            isLoading = false;
          });
          
          hls.on((window as any).Hls.Events.ERROR, (event: any, data: any) => {
            console.error('HLS error:', data);
            hasError = true;
            isLoading = false;
          });
        };
        script.onerror = () => {
          hasError = true;
          isLoading = false;
        };
        document.head.appendChild(script);
      }
      
      // Handle video events
      videoElement.addEventListener('loadeddata', () => {
        isLoading = false;
      });
      
      videoElement.addEventListener('error', () => {
        hasError = true;
        isLoading = false;
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
        <p class="text-sm">Video unavailable</p>
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
