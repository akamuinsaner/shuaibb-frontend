export const strToObj = (str: string) => {
    if (str.startsWith('?')) str = str.substring(1);
    let obj: { [name: string]: string } = {};
    str.split('&').map(keypair => {
        const [key, value] = keypair.split('=');
        obj[key] = value
    });
    return obj
}


export const sizeFormat = (size: number) => {
    if (size < 1024) return `${size}B`;
    if (size >= 1024 && size < 1024 * 1024) return `${(size / 1024).toFixed(2)}KB`;
    if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)}MB`;
}