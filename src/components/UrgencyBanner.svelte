<script>
  let { openCall, lang = 'pap' } = $props();
  
  const labels = {
    pap: {
      expired: "Periodo di inskripshon a kaba",
      critical: "Keda solamente {days} dia pa inskribí!",
      urgent: "Inskripshon ta sera den {days} dia",
      warning: "Inskripshon ta sera den {days} dia",
      open: "Periodo di inskripshon habri",
      applyNow: "Inskribí awor",
      days: "dia",
    },
    en: {
      expired: "Application period has ended",
      critical: "Only {days} days left to apply!",
      urgent: "Application closes in {days} days",
      warning: "Application closes in {days} days",
      open: "Application period open",
      applyNow: "Apply Now",
      days: "days",
    },
    nl: {
      expired: "De aanmeldingsperiode is afgelopen",
      critical: "Nog maar {days} dagen om je aan te melden!",
      urgent: "Aanmelding sluit over {days} dagen",
      warning: "Aanmelding sluit over {days} dagen",
      open: "Aanmeldingsperiode open",
      applyNow: "Meld je nu aan",
      days: "dagen",
    },
  };
  
  const l = $derived(labels[lang] ?? labels.pap);
  
  let timeLeft = $state({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  let isExpired = $state(false);
  
  function updateCountdown() {
    if (!openCall?.closeISO) return;
    
    const now = new Date();
    const deadline = new Date(openCall.closeISO);
    const diff = deadline - now;
    
    if (diff <= 0) {
      isExpired = true;
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return;
    }
    
    timeLeft = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  }
  
  // Update countdown every second
  $effect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  });
  
  function getUrgencyLevel() {
    if (isExpired) return 'expired';
    if (timeLeft.days <= 3) return 'critical';
    if (timeLeft.days <= 7) return 'urgent';
    if (timeLeft.days <= 14) return 'warning';
    return 'normal';
  }
  
  function getUrgencyMessage() {
    const level = getUrgencyLevel();
    switch (level) {
      case 'expired': return l.expired;
      case 'critical': return l.critical;
      case 'urgent': return l.urgent;
      case 'warning': return l.warning;
      default: return l.open;
    }
  }
</script>

{#if openCall && openCall.isOpen && !isExpired}
  <div class="urgency-banner urgency-{getUrgencyLevel()}">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full animate-pulse urgency-dot"></div>
          <div class="text-sm font-semibold">
            {getUrgencyMessage().replace('{days}', timeLeft.days)}
          </div>
        </div>
        
        {#if timeLeft.days <= 7}
          <div class="flex items-center gap-4 text-sm">
            {#if timeLeft.days > 0}
              <div class="flex items-center gap-1">
                <span class="font-bold text-lg">{timeLeft.days}</span>
                <span>{l.days}</span>
              </div>
            {/if}
            <div class="flex items-center gap-1">
              <span class="font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span>:</span>
              <span class="font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span>:</span>
              <span class="font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            </div>
          </div>
        {/if}
        
        <a 
          href={openCall.applyLink || '/sustain#apply'}
          class="btn-primary btn-sm btn-cap font-bold urgency-cta"
        >
          {l.applyNow}
        </a>
      </div>
    </div>
  </div>
{/if}

<style>
  .urgency-banner {
    border-bottom: 1px solid #e5e7eb;
  }
  
  .urgency-normal {
    background-color: #eff6ff;
    border-color: #bfdbfe;
  }
  
  .urgency-warning {
    background-color: #fefce8;
    border-color: #fde047;
  }
  
  .urgency-urgent {
    background-color: #fff7ed;
    border-color: #fed7aa;
  }
  
  .urgency-critical {
    background-color: #fef2f2;
    border-color: #fecaca;
  }
  
  .urgency-dot {
    background: var(--color-sustain);
  }
  
  .urgency-critical .urgency-dot {
    background: #dc2626;
  }
  
  .urgency-urgent .urgency-dot {
    background: #ea580c;
  }
  
  .urgency-warning .urgency-dot {
    background: #d97706;
  }
  
  .urgency-cta {
    background: var(--color-sustain) !important;
    border-color: var(--color-sustain) !important;
  }
  
  .urgency-critical .urgency-cta {
    background: #dc2626 !important;
    border-color: #dc2626 !important;
  }
</style>
