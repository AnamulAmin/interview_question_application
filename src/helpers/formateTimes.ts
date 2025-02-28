function addMinutes(minutes: number) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);

  // Formatting to 24-hour format
  let hours = now.getHours();
  let minutesFormatted = now.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutesFormatted}`;
}

export default addMinutes;
