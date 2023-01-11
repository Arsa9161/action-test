<template>
  <div>
    Hi
    {{ contentful }}
  </div>
</template>

<script>
import json from "@/static/contentful.json";
export default {
  computed: {
    contentful() {
      return json;
    },
  },
  mounted() {
    console.log(json);
  },
};
</script>
