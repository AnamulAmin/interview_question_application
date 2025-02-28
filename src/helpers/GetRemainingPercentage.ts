function getRemainingPercentage(prepTime, orderTime, orderDate) {
  if (
    !orderTime ||
    !orderDate ||
    typeof orderTime !== "string" ||
    typeof orderDate !== "string"
  ) {
    return "Invalid order time or date format";
  }

  // Construct the full orderDateTime string
  const orderDateTimeString = `${orderDate}T${orderTime}`;
  const orderDateTime = new Date(orderDateTimeString);

  // Check if the date is valid
  if (isNaN(orderDateTime.getTime())) {
    return "Invalid order date or time format";
  }

  // Calculate the preparation end time
  const prepEndTime = new Date(orderDateTime.getTime() + prepTime * 60 * 1000);

  function updatePercentage() {
    const now = new Date();
    const timeLeft = prepEndTime - now;

    // If time is up, stop the interval
    if (timeLeft <= 0) {
      console.log(`⏳ Order is ready! 0% remaining.`);
      //   clearInterval(intervalId); // Stop rendering updates
      return 0;
    }

    // Convert time left to minutes
    const timeLeftMinutes = timeLeft / (1000 * 60);
    const percentageLeft = (timeLeftMinutes / prepTime) * 100;

    console.log(
      `🕒 Time Left: ${timeLeftMinutes.toFixed(
        2
      )} min | 📉 ${percentageLeft.toFixed(2)}% remaining`
    );
    return percentageLeft;
  }

  // Call the function every second and store the interval ID
  //   const intervalId = setInterval(updatePercentage, 1000);

  // Run once immediately
  return updatePercentage();
}

export default getRemainingPercentage;
