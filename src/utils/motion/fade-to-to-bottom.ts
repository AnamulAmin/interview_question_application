export function fadeTopToBottom() {
  return {
    initial: { y: "-100%" }, // Drawer initially slides down from the top
    animate: { y: 0 }, // Slides into position
    exit: { y: "100%" }, // Slides back up when closed
    transition: { duration: 0.5, ease: "easeInOut" }, // Smooth animation
  };
}
