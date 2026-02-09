import jwt from 'jsonwebtoken';

export const adminLogin = (req, res) => {
    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        const token = jwt.sign(
            { role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.json({
            success: true,
            token,
        });
    }

    return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
    });
};