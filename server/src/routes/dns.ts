import { Router, Request, Response } from 'express';

const router = Router();

router.post('/register', async (req: Request, res: Response): Promise<any> => {
    const { subdomain, companyName } = req.body;
    if (!subdomain) {
        return res.status(400).json({ success: false, message: 'Subdomain parameter is missing.' });
    }

    const cleanSub = subdomain.trim().toLowerCase();
    const apiKey = process.env.GODADDY_API_KEY;
    const apiSecret = process.env.GODADDY_API_SECRET;
    const domain = process.env.GODADDY_DOMAIN || 'realtysarv.com';

    // Check if credentials are present
    if (!apiKey || !apiSecret) {
        console.warn('GoDaddy credentials not configured in environmental settings. Mocking dynamic registration...');
        return res.json({
            success: true,
            simulated: true,
            subdomain: cleanSub,
            domain: domain,
            cnameTarget: 'ingress.realtysarv.com',
            message: `Subdomain "${cleanSub}.${domain}" matched configuration! Simulated live DNS setup. To connect your live GoDaddy domain, add GODADDY_API_KEY and GODADDY_API_SECRET to your environment variables.`
        });
    }

    try {
        console.log(`Setting up live CNAME at GoDaddy: CNAME ${cleanSub} points to ingress.realtysarv.com`);
        const url = `https://api.godaddy.com/v1/domains/${domain}/records/CNAME/${cleanSub}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `sso-key ${apiKey}:${apiSecret}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([
                {
                    data: 'ingress.realtysarv.com',
                    ttl: 3600
                }
            ])
        });

        if (response.status === 200 || response.status === 201) {
            return res.json({
                success: true,
                simulated: false,
                subdomain: cleanSub,
                domain: domain,
                cnameTarget: 'ingress.realtysarv.com',
                message: `GoDaddy DNS dynamic pointer created! Subdomain "${cleanSub}.${domain}" is officially mapped live.`
            });
        } else {
            const errorDetails = await response.text();
            console.error('GoDaddy API response failed:', errorDetails);
            return res.status(502).json({
                success: false,
                message: `GoDaddy API rejected registration request: ${errorDetails} (Status: ${response.status})`
            });
        }
    } catch (err: any) {
        console.error('Network error requesting GoDaddy service:', err);
        return res.status(500).json({
            success: false,
            message: `Failed to broadcast to GoDaddy DNS: ${err.message || err}`
        });
    }
});

export default router;
