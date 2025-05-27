module.exports = async function (context, order) {
    context.log(`Processing payment for order: ${order.id}`);
    if (order.cardDeclined) {
        throw new Error("Payment failed");
    }
    return true;
};
