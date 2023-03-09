import _ from 'lodash'

export function isEmail(email: string, regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/): boolean {
    return regex.test(email)
}
export function isPassword(
    password: string,
    pwLenArr: [number, number] = [8, 15],
    regexArr: Array<RegExp> = [/[0-9]/, /[a-zA-Z]/, /[~!@#$%^&*()_+|<>?:{}]/, /^\S*$/]
) {
    return (
        _.every(regexArr, (pattern) => {
            return pattern.test(password)
        }) &&
        pwLenArr[0] <= password.length &&
        pwLenArr[1] >= password.length
    )
}
