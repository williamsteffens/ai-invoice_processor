export function formatAmount(
    value: number | string,
    currency: string,
): string {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "—";
    }

    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
        }).format(amount);
    } catch {
        return `${amount.toFixed(2)} ${currency}`;
    }
}