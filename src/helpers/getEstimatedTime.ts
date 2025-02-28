export default function getEstimatedTime(
  prepTime: number,
  orderTime: string,
  orderDate: string
) {
  if (!orderTime || !orderDate || isNaN(prepTime) || prepTime <= 0) {
    return "Invalid input";
  }

  // Convert `orderTime` and `orderDate` into a Date object
  const orderDateTime = new Date(`${orderDate}T${orderTime}`);

  // Check if the date is valid
  if (isNaN(orderDateTime.getTime())) {
    return "Invalid date format";
  }

  // Add preparation time (in minutes) to order time
  const estimatedCompletion = new Date(
    orderDateTime.getTime() + prepTime * 60 * 1000
  );

  // Format as `YYYY-MM-DDTHH:mm` (for datetime-local input)
  const formattedDateTime = estimatedCompletion.toISOString().slice(0, 16);

  return formattedDateTime;
}
