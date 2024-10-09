import jwt from 'jsonwebtoken';
const verifyToken = async (req, res, next) => {
    const secret = "Scanmaa24";
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

         // Comprobación si el token contiene un DNI válido
         if (!decoded || !decoded.DNI) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Almacenamos el DNI del médico en el objeto req
        req.userDNI = decoded.DNI;  // El DNI del médico

        next();  // Pasamos al siguiente middleware o controlador
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
 
};

export default verifyToken;