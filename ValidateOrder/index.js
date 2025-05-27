module.exports = async function (context, order) {
    context.log(`Validating order: ${order.id}`);
    if (order.item === "unavailable-item") {
        throw new Error("Item out of stock");
    }
    return true;
};
