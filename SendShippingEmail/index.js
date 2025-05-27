module.exports = async function (context, order) {
    context.log(`Sending shipping confirmation to ${order.userEmail}`);
    return true;
};
