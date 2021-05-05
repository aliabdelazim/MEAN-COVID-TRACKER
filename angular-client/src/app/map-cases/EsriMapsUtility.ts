export enum EsriStyle {
    WorldLightGrayMap = 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer',
    WorldDarkGrayMap= 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
}

export class EsriUtility {

    public static getUri(style: EsriStyle): string {

        const isHttpSecured = window.location.toString().startsWith('https:');
        let uri: string = style;
        if (!isHttpSecured) {
            uri = uri.replace('https:', 'http:');
        }
        return uri;
    }
}
