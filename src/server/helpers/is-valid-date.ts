

export function isValidDate(date, textError) {
    if (!(new Date(date).toString() !== "Invalid Date" && !isNaN(+ new Date(date) ))) {
        throw new Error(textError);
    }
}

export function isValidTimeStamp(date, textError) {
    if (!/\d{10}/.test((+ new Date(date)).toString())) {
        throw new Error(textError);
    }
}

export function isValidYear(date, textError) {
    if (!(/\d{4}/.test(date) && date.toString().length === 4)) {
        throw new Error(textError);
    }
}
