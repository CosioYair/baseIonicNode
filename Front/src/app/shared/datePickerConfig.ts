const monthsList = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    es: ['Ene', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export const dateLocale = 'zh-Hans-CN';

export const dateLocaleOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

export function datePickerOptions(language: string) {
    return {
        toDate: new Date(),
        closeOnSelect: true,
        showTodayButton: false,
        closeLabel: 'Close',
        monthsList: monthsList[language],
        clearButton: false,
        dateFormat: 'YYYY/MM/DD'
    }
};
