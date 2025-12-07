<script lang="ts">
  import type { Lang } from "../../i18n/ui";

  interface Props {
    lang: Lang;
  }

  let { lang }: Props = $props();

  // Mailchimp form action URL
  const mailchimpAction = "https://radicaldata.us22.list-manage.com/subscribe/post?u=f5821483158a70b8e66244290&id=4f3154a8a9&f_id=0082dce1f0";
  const honeypotName = "b_f5821483158a70b8e66244290_4f3154a8a9";
  const tagValue = "26597";

  const labels = {
    pap: {
      email: "Email",
      emailRequired: "Requerí",
      submit: "Uni cu mailing list",
      privacy: "Nos lo usa bo detayenan so pa comparti actualisacionnan tocante Creando Futuronan. Bo por cancela bo suscripcion na cualkier momento.",
      successTitle: "Bo ta den. ✉️",
      successBody: "Danki pa uni cu nos mailing list. Nos lo contacta bo ora programanan, workshopnan i eventonan nobo ta listo pa comparti.",
      successBody2: "Mientras tanto, bo por tambe sigui nos riba Instagram i WhatsApp pa mira loke nos ta traha dia pa dia.",
      error: "Algo a sali mal ora di entrega bo detayenan.",
      errorRetry: "Por fabor intenta atrobe den un momento, o mensa nos riba WhatsApp si e problema ta continua.",
      emailInvalid: "Por fabor usa un email válido",
      emailRequiredError: "Email ta requerí",
    },
    en: {
      email: "Email",
      emailRequired: "Required",
      submit: "Join mailing list",
      privacy: "We'll only use your details to share updates about Creando Futuronan. You can unsubscribe at any time.",
      successTitle: "You're in. ✉️",
      successBody: "Thank you for joining our mailing list. We'll be in touch when new programmes, workshops and events are ready to share.",
      successBody2: "In the meantime, you can also follow us on Instagram and WhatsApp to see what we're working on day to day.",
      error: "Something went wrong while submitting your details.",
      errorRetry: "Please try again in a moment, or message us on WhatsApp if the problem continues.",
      emailInvalid: "Please enter a valid email address",
      emailRequiredError: "Email is required",
    },
    nl: {
      email: "E-mail",
      emailRequired: "Verplicht",
      submit: "Doe mee met mailinglijst",
      privacy: "We gebruiken je gegevens alleen om updates over Creando Futuronan te delen. Je kunt je op elk moment uitschrijven.",
      successTitle: "Je bent erbij. ✉️",
      successBody: "Bedankt voor het deelnemen aan onze mailinglijst. We nemen contact met je op wanneer nieuwe programma's, workshops en evenementen klaar zijn om te delen.",
      successBody2: "Ondertussen kun je ons ook volgen op Instagram en WhatsApp om te zien waar we dagelijks aan werken.",
      error: "Er is iets misgegaan bij het indienen van je gegevens.",
      errorRetry: "Probeer het over een moment opnieuw, of stuur ons een bericht via WhatsApp als het probleem aanhoudt.",
      emailInvalid: "Voer een geldig e-mailadres in",
      emailRequiredError: "E-mail is verplicht",
    },
  };

  const l = $derived(labels[lang] ?? labels.en);

  let email = $state("");
  let isSubmitting = $state(false);
  let isSuccess = $state(false);
  let error = $state("");
  let emailError = $state("");

  function validateEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  function handleEmailBlur() {
    if (!email) {
      emailError = l.emailRequiredError;
    } else if (!validateEmail(email)) {
      emailError = l.emailInvalid;
    } else {
      emailError = "";
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = "";
    emailError = "";

    // Validate email
    if (!email) {
      emailError = l.emailRequiredError;
      return;
    }
    if (!validateEmail(email)) {
      emailError = l.emailInvalid;
      return;
    }

    isSubmitting = true;

    try {
      // Build form data for Mailchimp
      const formData = new FormData();
      formData.append("EMAIL", email);
      formData.append("tags", tagValue);
      formData.append(honeypotName, "");

      // Submit to Mailchimp
      await fetch(mailchimpAction, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      // Show success state (Mailchimp handles the actual subscription)
      isSuccess = true;
    } catch (err) {
      console.error("Form submission error:", err);
      error = l.error;
      isSubmitting = false;
    }
  }
</script>

{#if isSuccess}
  <div class="text-center py-8">
    <h3 class="h3 mb-4">{l.successTitle}</h3>
    <p class="text-black/75 mb-2">{l.successBody}</p>
    <p class="text-black/75">{l.successBody2}</p>
  </div>
{:else}
  <form
    action={mailchimpAction}
    method="post"
    id="creando-join-form"
    class="creando-join-form space-y-6"
    novalidate
    onsubmit={handleSubmit}
  >
    {#if error}
      <div class="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
        <p class="font-semibold mb-1">{l.error}</p>
        <p>{l.errorRetry}</p>
      </div>
    {/if}

    <!-- Email -->
    <div class="form-row">
      <label for="mce-EMAIL" class="block text-sm font-medium mb-2">
        {l.email}
        <span aria-hidden="true" class="text-black/60">*</span>
      </label>
      <input
        type="email"
        name="EMAIL"
        id="mce-EMAIL"
        bind:value={email}
        onblur={handleEmailBlur}
        required
        placeholder="you@example.com"
        class="w-full px-4 py-3 rounded-lg border-2 border-black/20 focus:border-[--color-brand] focus:outline-none focus:ring-2 focus:ring-[--color-brand]/20 transition-colors"
        class:border-red-300={emailError}
        aria-invalid={!!emailError}
        aria-describedby={emailError ? "email-error" : undefined}
      />
      {#if emailError}
        <p id="email-error" class="mt-1 text-sm text-red-600">{emailError}</p>
      {/if}
    </div>

    <!-- Hidden tag field for tracking -->
    <input type="hidden" name="tags" value={tagValue} />

    <!-- Honeypot field for spam protection -->
    <div style="position:absolute; left:-5000px;" aria-hidden="true">
      <input
        type="text"
        name={honeypotName}
        tabindex="-1"
        value=""
      />
    </div>

    <!-- Submit button -->
    <button
      type="submit"
      disabled={isSubmitting}
      class="btn-primary btn-md sm:btn-lg btn-cap font-bold shadow-lg hover:shadow-xl w-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Submitting..." : l.submit}
    </button>

    <!-- Privacy note -->
    <p class="text-xs text-black/60 text-center">{l.privacy}</p>
  </form>
{/if}

