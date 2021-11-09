<script>
  /**
   * Specify the id
   */
  export let id = "toggle" + Math.random().toString(36);

  /**
   * Specify whether the toggle switch is toggled
   */
  export let toggled = true;

  /**
   * Set to `true` to disable the button
   */
  export let disabled = false;

  $: label = { for: id };
  $: button = {
    ...$$restProps,
    id,
    disabled,
    "aria-checked": toggled,
    "aria-labelledby": id,
    type: "button",
    role: "switch",
  };
</script>

<slot {label} {button} />
