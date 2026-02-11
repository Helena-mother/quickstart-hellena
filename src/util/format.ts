export const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "AOA",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(value)
    // .replace("AOA", "kz");
};