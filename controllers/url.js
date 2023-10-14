const URL = require('../models/url')
const urlParser = require('url')
const dns = require('dns')
const shortid = require('shortid');
function handleGenerateNewShortURL(req, res) {
    const urlToShorten = req.body.url;
    if (!urlToShorten) return res.status(400).json({
        error: "URL is required"
    })
    dns.lookup(urlParser.parse(urlToShorten).hostname, async (err, address) => {
        if (err) {
            return res.json({
                "error": "Invalid URL"
            })
        }
        try {
            const shortId = shortid();
            await URL.create({
                shortId: shortId,
                redirectURL: urlToShorten,
                visitHistory: [],
                createdBy: req.user?._id,
            })
            return res.json({
                id: shortId
            })
        } catch (err) {
            console.log("Error Creating Document: ", err)
            res.status(500).json({ "error": "Internal Server Error" })
        }
    })

}
async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId })
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    })
}
module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
}