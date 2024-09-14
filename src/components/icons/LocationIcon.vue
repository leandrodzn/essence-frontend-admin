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
      d="M25 23.958a5.208 5.208 0 1 1 0-10.416 5.208 5.208 0 0 1 0 10.416Zm0-19.791A14.583 14.583 0 0 0 10.416 18.75C10.416 29.688 25 45.833 25 45.833S39.583 29.688 39.583 18.75A14.583 14.583 0 0 0 25 4.167Z"
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
