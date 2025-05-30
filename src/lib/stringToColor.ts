export default function stringToColor(str: string | null | undefined): string {
    if (!str) {
        return "#CCCCCC"; // Default color for null/undefined/empty
    }
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c; 
}