<script>
  import { Calendar } from '$lib/components/ui/calendar';
  import { Button } from '$lib/components/ui/button';
  import { getLocalTimeZone, today } from '@internationalized/date';
  
  import { localeForDates } from '../../i18n/dates';
  
  let { events = [], openCall = null, lang = 'pap' } = $props();
  
  const labels = {
    pap: {
      title: "Kalènder di evento",
      calendar: "Kalènder",
      list: "Lista",
      allEvents: "Tur evento",
      upcoming: "Evento ku ta bin",
      noUpcoming: "No tin ningun evento planeá",
      noEventsOnDate: "No tin evento riba e fecha akí",
      eventsOn: "Evento riba",
    },
    en: {
      title: "Events Calendar",
      calendar: "Calendar",
      list: "List",
      allEvents: "All events",
      upcoming: "Upcoming events",
      noUpcoming: "No upcoming events scheduled",
      noEventsOnDate: "No events on this date",
      eventsOn: "Events on",
    },
    nl: {
      title: "Evenementenkalender",
      calendar: "Kalender",
      list: "Lijst",
      allEvents: "Alle evenementen",
      upcoming: "Aankomende evenementen",
      noUpcoming: "Geen aankomende evenementen gepland",
      noEventsOnDate: "Geen evenementen op deze datum",
      eventsOn: "Evenementen op",
    },
  };
  
  const l = $derived(labels[lang] ?? labels.pap);
  
  let selectedDate = $state(null);
  let placeholder = $state(today(getLocalTimeZone()));
  let viewMode = $state('calendar'); // 'calendar' or 'list'
  let streamFilter = $state('all'); // 'all', 'spark', 'sustain'
  
  // Get events for a specific date
  function getEventsForDate(date) {
    // Handle different date object types
    let dateStr;
    if (date && typeof date.toISOString === 'function') {
      dateStr = date.toISOString().split('T')[0];
    } else if (date && date.year && date.month && date.day) {
      // Handle DateValue objects from the calendar
      dateStr = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    } else {
      return [];
    }
    
    return getAllFilteredEvents().filter(event => {
      const eventDate = new Date(event.dateISO).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  }
  
  // Check if a date has events
  function hasEvents(date) {
    // Handle different date object types
    let dateStr;
    if (date && typeof date.toISOString === 'function') {
      dateStr = date.toISOString().split('T')[0];
    } else if (date && date.year && date.month && date.day) {
      // Handle DateValue objects from the calendar
      dateStr = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    } else {
      return false;
    }
    
    // Check if any filtered event occurs on this date
    return getAllFilteredEvents().some(event => {
      const eventDate = new Date(event.dateISO).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  }
  
  function formatEventDate(dateISO) {
    const localeStr = localeForDates(lang);
    return new Date(dateISO).toLocaleDateString(localeStr, {
      timeZone: 'America/Aruba',
      day: '2-digit',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  function formatDateValue(dateValue) {
    if (!dateValue) return '';
    if (dateValue.toDate) {
      return dateValue.toDate(getLocalTimeZone()).toLocaleDateString();
    }
    return dateValue.toString();
  }
  
  function getEventStreamColor(event) {
    const isSpark = event.programme === 'spark';
    return isSpark ? 'var(--color-spark)' : 'var(--color-sustain)';
  }
  
  // Filter events to only show future events
  function getFutureEvents() {
    const now = new Date();
    return events.filter(event => {
      const eventDate = new Date(event.dateISO);
      return eventDate >= now;
    });
  }
  
  // Filter events by stream (for list view - only future events)
  function getFilteredEvents() {
    const futureEvents = getFutureEvents();
    if (streamFilter === 'all') return futureEvents;
    return futureEvents.filter(event => event.programme === streamFilter);
  }
  
  // Get all events filtered by stream (for calendar view - all events)
  function getAllFilteredEvents() {
    if (streamFilter === 'all') return events;
    return events.filter(event => event.programme === streamFilter);
  }
  
  
  
  function selectDate(date) {
    selectedDate = date;
  }
  
  
</script>

<div class="calendar-container">
  <!-- View Toggle (Mobile Only) -->
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 lg:hidden">
    <h3 class="text-lg font-semibold">{l.title}</h3>
    <div class="flex gap-2">
        <Button 
          variant={viewMode === 'calendar' ? 'default' : 'outline'}
          size="sm"
          onclick={() => viewMode = 'calendar'}
          class="flex-1 sm:flex-none"
          aria-pressed={viewMode === 'calendar'}
          aria-label={`Switch to ${l.calendar.toLowerCase()} view`}
        >
          {l.calendar}
        </Button>
        <Button 
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onclick={() => viewMode = 'list'}
          class="flex-1 sm:flex-none"
          aria-pressed={viewMode === 'list'}
          aria-label={`Switch to ${l.list.toLowerCase()} view`}
        >
          {l.list}
        </Button>
    </div>
  </div>
  
  <!-- Desktop Title -->
  <div class="hidden lg:block mb-6">
    <h3 class="text-lg font-semibold">{l.title}</h3>
  </div>

  <!-- Stream Filter -->
  <div class="mb-6 flex flex-wrap gap-2">
    <Button 
      variant={streamFilter === 'all' ? 'default' : 'outline'} 
      size="sm" 
      onclick={() => streamFilter = 'all'}
      class="text-xs"
    >
      {l.allEvents}
    </Button>
    <Button 
      variant={streamFilter === 'spark' ? 'default' : 'outline'} 
      size="sm" 
      onclick={() => streamFilter = 'spark'}
      class="text-xs flex items-center gap-2"
      style={streamFilter === 'spark' ? 'background-color: var(--color-spark); border-color: var(--color-spark);' : ''}
    >
      <div class="w-2 h-2 rounded-full bg-[var(--color-spark)]"></div>
      Spark
    </Button>
    <Button 
      variant={streamFilter === 'sustain' ? 'default' : 'outline'} 
      size="sm" 
      onclick={() => streamFilter = 'sustain'}
      class="text-xs flex items-center gap-2"
      style={streamFilter === 'sustain' ? 'background-color: var(--color-sustain); border-color: var(--color-sustain);' : ''}
    >
      <div class="w-2 h-2 rounded-full bg-[var(--color-sustain)]"></div>
      Sustain
    </Button>
  </div>

  <!-- Desktop Layout: Calendar + List Side by Side -->
  <div class="hidden lg:grid lg:grid-cols-2 lg:gap-8">
    <!-- Calendar View -->
    <div class="calendar-view">
      <!-- Shadcn Calendar Component -->
      <div class="mb-4">
        <Calendar 
          bind:selected={selectedDate}
          bind:placeholder={placeholder}
          on:select={(e) => selectDate(e.detail)}
          class="rounded-md border"
          locale="en-AW"
          weekStartsOn={1}
        >
          {#snippet day({ day, outsideMonth })}
            <div class="relative">
              <div class="day-number">{day.day}</div>
              {#if !outsideMonth && hasEvents(day)}
                <div class="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {#each getEventsForDate(day) as event}
                    <div 
                      class="w-2 h-2 rounded-full" 
                      style="background-color: {getEventStreamColor(event)};"
                      title={event.title}
                    ></div>
                  {/each}
                </div>
              {/if}
            </div>
          {/snippet}
        </Calendar>
      </div>
    </div>

    <!-- List View -->
    <div class="list-view">
      <h4 class="text-lg font-medium mb-4">{l.upcoming}</h4>
      {#if getFilteredEvents().length > 0}
        <div class="space-y-3">
          {#each getFilteredEvents().slice(0, 5) as event}
            <div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
              <div class="w-3 h-3 rounded-full" style="background-color: {getEventStreamColor(event)};"></div>
              <div class="flex-1">
                <div class="font-medium">{event.title}</div>
                <div class="text-sm text-gray-600">{formatEventDate(event.dateISO)}</div>
              </div>
              <div class="text-xs text-gray-500 uppercase">{event.island}</div>
            </div>
          {/each}
        </div>
        
      {:else}
        <div class="text-center py-8 text-gray-500">
          <p>{l.noUpcoming}</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Mobile Layout: Toggle between Calendar and List -->
  <div class="lg:hidden">

    {#if viewMode === 'calendar'}
      <!-- Calendar View -->
      <div class="calendar-view">
        <!-- Shadcn Calendar Component -->
        <div class="mb-4">
          <Calendar 
            bind:selected={selectedDate}
            bind:placeholder={placeholder}
            on:select={(e) => selectDate(e.detail)}
            class="rounded-md border"
            locale="en-AW"
            weekStartsOn={1}
          >
            {#snippet day({ day, outsideMonth })}
              <div class="relative">
                <div class="day-number">{day.day}</div>
                {#if !outsideMonth && hasEvents(day)}
                  <div class="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {#each getEventsForDate(day) as event}
                      <div 
                        class="w-2 h-2 rounded-full" 
                        style="background-color: {getEventStreamColor(event)};"
                        title={event.title}
                      ></div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/snippet}
          </Calendar>
        </div>
        
        <!-- Selected Date Events -->
        {#if selectedDate}
          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 class="font-medium mb-2">
                  {l.eventsOn} {formatDateValue(selectedDate)}
                </h5>
            {#if getEventsForDate(selectedDate).length > 0}
              <div class="space-y-2">
                {#each getEventsForDate(selectedDate) as event}
                  <div class="flex items-center gap-2 p-2 bg-white rounded border-l-4" 
                       style="border-left-color: {getEventStreamColor(event)};">
                    <div class="text-sm">
                      <div class="font-medium">{event.title}</div>
                      <div class="text-gray-600">{formatEventDate(event.dateISO)}</div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-gray-500 text-sm">{l.noEventsOnDate}</p>
            {/if}
          </div>
        {/if}
      </div>
    {:else}
      <!-- List View -->
      <div class="list-view">
        <h4 class="text-lg font-medium mb-4">{l.upcoming}</h4>
        {#if getFilteredEvents().length > 0}
          <div class="space-y-3">
            {#each getFilteredEvents() as event}
              <div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                <div class="w-3 h-3 rounded-full" style="background-color: {getEventStreamColor(event)};"></div>
                <div class="flex-1">
                  <div class="font-medium">{event.title}</div>
                  <div class="text-sm text-gray-600">{formatEventDate(event.dateISO)}</div>
                </div>
                <div class="text-xs text-gray-500 uppercase">{event.island}</div>
              </div>
            {/each}
          </div>
          
        {:else}
          <div class="text-center py-8 text-gray-500">
            <p>{l.noUpcoming}</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
  
  <!-- Open Call Alert -->
  {#if openCall && openCall.isOpen}
    <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span class="font-medium text-yellow-800">Open Call</span>
      </div>
      <div class="text-yellow-700">
        <div class="font-medium">{openCall.title}</div>
        {#if openCall.deadlineISO}
          <div class="text-sm">Deadline: {formatEventDate(openCall.deadlineISO)}</div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .calendar-container {
    font-family: var(--font-sans);
  }
</style>
