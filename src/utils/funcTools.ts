export const strToObj = (str: string) => {
    if (str.startsWith('?')) str = str.substring(1);
    let obj: { [name: string]: string } = {};
    str.split('&').map(keypair => {
        const [key, value] = keypair.split('=');
        obj[key] = value
    });
    return obj
}