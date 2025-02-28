type CartItem = {
  id: string;
  price: number;
  quantity: number;
};

type ItemDiscount = {
  id: string;
  buy: number;
  free: number;
};

type Discounts = {
  percentageDiscountActive: boolean;
  percentageDiscount: number;
  orderAboveForPercentageDiscount: number;
  flatDiscountActive: boolean;
  flatDiscount: number;
  orderAboveForFlatDiscount: number;
  itemDiscountsActive: boolean;
  itemDiscounts: ItemDiscount[];
  happyHourActive: boolean;
  happyHourStart: string; // e.g., '14:00'
  happyHourEnd: string; // e.g., '16:00'
  happyHourDiscount: number;
  loyaltyDiscountActive: boolean;
  loyaltyDiscount: number;
  promoCodeActive: boolean;
};

type DiscountResult = {
  totalDiscount: string;
  discountedTotal: string;
  appliedDiscounts: Array<{
    type: string;
    amount: string;
    itemId?: string;
  }>;
};

function calculateDiscounts(
  cart: CartItem[],
  discounts: Discounts,
  promoCode: string | null,
  promoDiscount: string | null
): DiscountResult {
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  let totalDiscount = 0;
  let appliedDiscounts: Array<{
    type: string;
    amount: string;
    itemId?: string;
  }> = [];

  // Percentage-based Discount
  if (
    discounts?.percentageDiscountActive &&
    cartTotal > discounts?.orderAboveForPercentageDiscount
  ) {
    const percentageDiscount =
      (cartTotal * discounts?.percentageDiscount) / 100;
    totalDiscount += percentageDiscount;
    appliedDiscounts.push({
      type: "Percentage-based Discount",
      amount: percentageDiscount.toFixed(2),
    });
  }

  // Flat Discount
  if (
    discounts?.flatDiscountActive &&
    cartTotal > discounts?.orderAboveForFlatDiscount
  ) {
    totalDiscount += discounts?.flatDiscount;
    appliedDiscounts.push({
      type: "Flat Discount",
      amount: discounts?.flatDiscount.toFixed(2),
    });
  }

  // Item-based Discounts
  if (discounts?.itemDiscountsActive) {
    cart.forEach((item: any) => {
      const itemDiscount = discounts?.itemDiscounts?.find(
        (d) => d.id === item.id
      );
      if (itemDiscount && item.quantity >= itemDiscount.buy) {
        const freeItems =
          Math.floor(item.quantity / itemDiscount.buy) * itemDiscount.free;
        const freeValue = freeItems * item.price;
        totalDiscount += freeValue;
        appliedDiscounts.push({
          type: "Item-based Discount",
          itemId: item.id,
          amount: freeValue.toFixed(2),
        });
      }
    });
  }

  // Time-based Discounts (Happy Hour)
  if (discounts?.happyHourActive) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    if (
      currentTime >= discounts?.happyHourStart &&
      currentTime <= discounts?.happyHourEnd
    ) {
      const happyHourDiscount =
        (cartTotal * discounts?.happyHourDiscount) / 100;
      totalDiscount += happyHourDiscount;
      appliedDiscounts.push({
        type: "Happy Hour Discount",
        amount: happyHourDiscount.toFixed(2),
      });
    }
  }

  // Loyalty Discount
  if (discounts?.loyaltyDiscountActive) {
    const loyaltyDiscount = (cartTotal * discounts?.loyaltyDiscount) / 100;
    totalDiscount += loyaltyDiscount;
    appliedDiscounts.push({
      type: "Loyalty Discount",
      amount: loyaltyDiscount.toFixed(2),
    });
  }

  // Promo Code Discount
  if (discounts?.promoCodeActive && promoCode && promoDiscount) {
    totalDiscount += parseFloat(promoDiscount);
    appliedDiscounts.push({
      type: "Promo Code Discount",
      amount: parseFloat(promoDiscount).toFixed(2),
    });
  }

  // Calculate the discounted total
  const discountedTotal = Math.max(0, cartTotal - totalDiscount);

  return {
    totalDiscount: totalDiscount.toFixed(2),
    discountedTotal: discountedTotal.toFixed(2),
    appliedDiscounts,
  };
}

export default calculateDiscounts;
