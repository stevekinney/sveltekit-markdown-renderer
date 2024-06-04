<script lang="ts">
  import Editor from '$lib/components/editor.svelte';
  import Markdown from '$lib/components/markdown.svelte';

  export let data;

  let content = data.content || '';
</script>

<main class="grid h-screen grid-cols-2">
  <Editor {content} on:change={(event) => (content = event.detail.value)} />
  <Markdown {content} />
</main>
