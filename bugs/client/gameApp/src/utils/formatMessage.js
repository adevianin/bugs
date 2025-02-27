// 'максимальна довжина {0} символів, від {1} до {2}'
// formatMessage(str, 5, 10, 20)
function formatMessage(template, ...values) {
    return template.replace(/{(\d+)}/g, (_, index) => values[index] || '');
}

export {
    formatMessage
}