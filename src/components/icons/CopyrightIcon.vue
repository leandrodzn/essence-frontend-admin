<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    fill="none"
    viewBox="0 0 30 30"
  >
    <g clip-path="url(#a)">
      <path
        :fill="fillColor"
        d="M15 2.813a12.188 12.188 0 1 1 0 24.375 12.188 12.188 0 0 1 0-24.375ZM15 30a15 15 0 1 0 0-30 15 15 0 0 0 0 30Zm-3.316-11.684a4.69 4.69 0 0 1 0-6.626 4.69 4.69 0 0 1 6.627 0 1.406 1.406 0 0 0 1.986-1.986 7.497 7.497 0 0 0-10.606 0 7.497 7.497 0 0 0 0 10.605 7.497 7.497 0 0 0 10.606 0 1.406 1.406 0 0 0-1.986-1.986 4.69 4.69 0 0 1-6.627 0v-.007Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h30v30H0z" />
      </clipPath>
    </defs>
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
