module.exports = async function (context, order) {
    context.log(`Reserving inventory for order: ${order.id}`);
    return true;
};
