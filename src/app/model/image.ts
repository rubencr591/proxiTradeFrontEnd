export class Image{
    
    base64: string;

    static detectImageExtension(base64String: string): string | null {

        if(base64String == null || base64String == '') return null;
        // Extraemos la parte del encabezado que contiene el tipo de imagen
        const header = base64String.substring(0, 20); 
    
        //Detección de la extensión de la imagen
        const imageHeaders: { [header: string]: string } = {
            '/9j/': 'jpg', // JPEG
            'iVBORw0KGgo=': 'png', // PNG
            'R0lGODlh': 'gif', // GIF
            'PHN2ZyB': 'svg+xml' // SVG
        };
    
        for (const [header, ext] of Object.entries(imageHeaders)) {
            if (header === header || base64String.startsWith(header)) {
                return ext;
            }
        }
    
        return null;
      }
}