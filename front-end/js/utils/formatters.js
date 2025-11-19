export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

export const formatQuantity = (value, unit = 'g') => {
    return `${value} ${unit}`;
};
