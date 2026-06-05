<template>
  <div>
    <UPageHero
      title="Theme Preview"
      description="A live preview of all CSS variable design tokens — colors, text, backgrounds, borders, and radius."
    />

    <UContainer class="py-6 space-y-8">
      <!-- COLORS -->
      <section>
        <h2 class="text-2xl font-bold text-highlighted mb-1">Colors</h2>
        <p class="text-muted mb-6">
          Semantic color tokens available as utility classes like
          <code class="text-sm bg-elevated px-1.5 py-0.5 rounded-md">text-primary</code> or
          <code class="text-sm bg-elevated px-1.5 py-0.5 rounded-md">bg-success</code>.
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div v-for="c in semanticColors" :key="c.name" class="flex flex-col items-center gap-2">
            <div class="w-full h-16 rounded-lg shadow-sm" :class="c.bg" />
            <span class="text-sm font-medium text-default capitalize">{{ c.name }}</span>
            <code class="text-xs text-muted">{{ c.bg }}</code>
          </div>
        </div>

        <div class="mt-6 p-4 bg-elevated rounded-xl border border-default">
          <p class="text-xs font-mono text-muted mb-2">CSS Variables (Light / Dark)</p>
          <pre class="text-xs text-default overflow-x-auto"><code>:root {
  --ui-primary:   var(--ui-color-primary-500);
  --ui-secondary: var(--ui-color-secondary-500);
  --ui-success:   var(--ui-color-success-500);
  --ui-info:      var(--ui-color-info-500);
  --ui-warning:   var(--ui-color-warning-500);
  --ui-error:     var(--ui-color-error-500);
}</code></pre>
        </div>
      </section>

      <USeparator />

      <!-- TEXT -->
      <section>
        <h2 class="text-2xl font-bold text-highlighted mb-1">Text</h2>
        <p class="text-muted mb-6">Text color tokens for semantic hierarchy.</p>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div v-for="t in textTokens" :key="t.label" class="flex flex-col items-center gap-2">
            <div
              class="w-full h-16 rounded-lg shadow-sm flex items-center justify-center"
              :class="t.bg"
            >
              <span class="text-base font-semibold" :class="t.textClass">Aa</span>
            </div>
            <span class="text-sm font-medium text-default">{{ t.label }}</span>
            <code class="text-xs text-muted">{{ t.textClass }}</code>
          </div>
        </div>

        <div class="mt-6 p-4 bg-elevated rounded-xl border border-default">
          <p class="text-xs font-mono text-muted mb-2">CSS Variables (Light)</p>
          <pre class="text-xs text-default overflow-x-auto"><code>:root {
  --ui-text-dimmed:      var(--ui-color-neutral-400);
  --ui-text-muted:       var(--ui-color-neutral-500);
  --ui-text-toned:       var(--ui-color-neutral-600);
  --ui-text:             var(--ui-color-neutral-700);
  --ui-text-highlighted: var(--ui-color-neutral-900);
  --ui-text-inverted:    white;
}</code></pre>
        </div>
      </section>

      <USeparator />

      <!-- BACKGROUNDS -->
      <section>
        <h2 class="text-2xl font-bold text-highlighted mb-1">Background</h2>
        <p class="text-muted mb-6">Background color tokens for layered surfaces.</p>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div v-for="bg in bgTokens" :key="bg.label" class="flex flex-col items-center gap-2">
            <div class="w-full h-16 rounded-lg shadow-sm border border-default" :class="bg.class" />
            <span class="text-sm font-medium text-default">{{ bg.label }}</span>
            <code class="text-xs text-muted">{{ bg.class }}</code>
          </div>
        </div>

        <div class="mt-6 p-4 bg-elevated rounded-xl border border-default">
          <p class="text-xs font-mono text-muted mb-2">CSS Variables (Light)</p>
          <pre class="text-xs text-default overflow-x-auto"><code>:root {
  --ui-bg:           white;
  --ui-bg-muted:     var(--ui-color-neutral-50);
  --ui-bg-elevated:  var(--ui-color-neutral-100);
  --ui-bg-accented:  var(--ui-color-neutral-200);
  --ui-bg-inverted:  var(--ui-color-neutral-900);
}</code></pre>
        </div>
      </section>

      <USeparator />

      <!-- BORDERS -->
      <section>
        <h2 class="text-2xl font-bold text-highlighted mb-1">Border</h2>
        <p class="text-muted mb-6">Border color tokens for dividers and outlines.</p>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="b in borderTokens" :key="b.label" class="flex flex-col items-center gap-2">
            <div class="w-full h-16 rounded-lg bg-elevated border-2" :class="b.class" />
            <span class="text-sm font-medium text-default">{{ b.label }}</span>
            <code class="text-xs text-muted">{{ b.class }}</code>
          </div>
        </div>

        <div class="mt-6 p-4 bg-elevated rounded-xl border border-default">
          <p class="text-xs font-mono text-muted mb-2">CSS Variables (Light)</p>
          <pre class="text-xs text-default overflow-x-auto"><code>:root {
  --ui-border:          var(--ui-color-neutral-200);
  --ui-border-muted:    var(--ui-color-neutral-200);
  --ui-border-accented: var(--ui-color-neutral-300);
  --ui-border-inverted: var(--ui-color-neutral-900);
}</code></pre>
        </div>
      </section>

      <USeparator />

      <!-- RADIUS -->
      <section>
        <h2 class="text-2xl font-bold text-highlighted mb-1">Radius</h2>
        <p class="text-muted mb-6">
          Border radius scale derived from
          <code class="text-sm bg-elevated px-1.5 py-0.5 rounded-md">--ui-radius</code> base value.
        </p>

        <div class="flex flex-wrap items-end gap-4">
          <div v-for="r in radiusTokens" :key="r.label" class="flex flex-col items-center gap-2">
            <div class="w-16 h-16 bg-primary" :class="r.class" />
            <code class="text-xs text-muted">rounded-{{ r.label }}</code>
          </div>
        </div>

        <div class="mt-6 p-4 bg-elevated rounded-xl border border-default">
          <p class="text-xs font-mono text-muted mb-2">CSS Variable</p>
          <pre class="text-xs text-default overflow-x-auto"><code>:root {
  --ui-radius: 0.25rem;
}</code></pre>
        </div>
      </section>

      <USeparator />

      <!-- CONTAINER & HEADER -->
      <section class="pb-6">
        <h2 class="text-2xl font-bold text-highlighted mb-1">Container and Header</h2>
        <p class="text-muted mb-6">Layout tokens for container width and header height.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-5 bg-muted rounded-xl border border-default">
            <p class="text-sm font-semibold text-highlighted mb-1">Container</p>
            <p class="text-sm text-muted mb-3">
              Max-width of the
              <code class="bg-elevated px-1 py-0.5 rounded text-xs">UContainer</code> component.
            </p>
            <pre class="text-xs text-default"><code>:root {
  --ui-container: 80rem;
}</code></pre>
          </div>
          <div class="p-5 bg-muted rounded-xl border border-default">
            <p class="text-sm font-semibold text-highlighted mb-1">Header Height</p>
            <p class="text-sm text-muted mb-3">
              Height of the
              <code class="bg-elevated px-1 py-0.5 rounded text-xs">UHeader</code> component.
            </p>
            <pre class="text-xs text-default"><code>:root {
  --ui-header-height: 4rem;
}</code></pre>
          </div>
        </div>
      </section>
    </UContainer>
  </div>
</template>

<script setup>
const semanticColors = [
  { name: 'primary', bg: 'bg-primary' },
  { name: 'secondary', bg: 'bg-secondary' },
  { name: 'success', bg: 'bg-success' },
  { name: 'info', bg: 'bg-info' },
  { name: 'warning', bg: 'bg-warning' },
  { name: 'error', bg: 'bg-error' }
]

const textTokens = [
  { textClass: 'text-dimmed', bg: 'bg-elevated', label: 'Dimmed' },
  { textClass: 'text-muted', bg: 'bg-elevated', label: 'Muted' },
  { textClass: 'text-toned', bg: 'bg-elevated', label: 'Toned' },
  { textClass: 'text-default', bg: 'bg-elevated', label: 'Text' },
  { textClass: 'text-highlighted', bg: 'bg-elevated', label: 'Highlighted' },
  { textClass: 'text-inverted', bg: 'bg-inverted', label: 'Inverted' }
]

const bgTokens = [
  { class: 'bg-default', label: 'Default' },
  { class: 'bg-muted', label: 'Muted' },
  { class: 'bg-elevated', label: 'Elevated' },
  { class: 'bg-accented', label: 'Accented' },
  { class: 'bg-inverted', label: 'Inverted' }
]

const borderTokens = [
  { class: 'border-default', label: 'Default' },
  { class: 'border-muted', label: 'Muted' },
  { class: 'border-accented', label: 'Accented' },
  { class: 'border-inverted', label: 'Inverted' }
]

const radiusTokens = [
  { class: 'rounded-xs', label: 'xs' },
  { class: 'rounded-sm', label: 'sm' },
  { class: 'rounded-md', label: 'md' },
  { class: 'rounded-lg', label: 'lg' },
  { class: 'rounded-xl', label: 'xl' },
  { class: 'rounded-2xl', label: '2xl' },
  { class: 'rounded-3xl', label: '3xl' }
]
</script>
