<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    fill="none"
    viewBox="0 0 50 50"
  >
    <path
      :fill="fillColor"
      d="m5.357 18.078 19.025 9.895a1.34 1.34 0 0 0 1.236 0l19.025-9.893v17.188a5.803 5.803 0 0 1-5.475 5.794l-.329.01H11.161a5.803 5.803 0 0 1-5.795-5.476l-.01-.328v-17.19Zm5.804-9.15h27.678a5.803 5.803 0 0 1 5.795 5.475l.009.329v.329L25 25.275 5.357 15.06v-.329a5.803 5.803 0 0 1 5.475-5.795l.329-.009Z"
    />
  </svg>
</template>
<script>
export default {
  props: {
    width: {
      type: String,
      default: "1.1rem",
    },
    height: {
      type: String,
      default: "1.1rem",
    },
    fillColor: {
      type: String,
      default: "#E5D3DA",
    },
  },
};
</script>
