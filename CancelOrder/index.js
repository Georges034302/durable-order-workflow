module.exports = async function (context, order) {
    context.log(`Rolling back order ${order.id}`);
    return true;
};
