<script lang="ts">
  export let content: string;
</script>

<section class="h-full w-full bg-slate-100 p-16">
  <iframe
    title="output"
    src="/render?content={encodeURIComponent(content)}"
    class="h-full w-full rounded-md bg-white p-8 shadow-md"
  />
</section>
