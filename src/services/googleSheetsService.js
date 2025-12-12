/**
 * Service to handle communication with Google Sheets via Google Apps Script Web App
 */

export const submitToGoogleSheet = async (webhookUrl, data) => {
    if (!webhookUrl) return { success: false, error: 'No Webhook URL configured' };

    try {
        // We use no-cors because Google Apps Script Web Apps don't support CORS preflight
        // for opaque requests easily without redirects, but 'no-cors' means we can't read the response.
        // However, usually we can use a simple POST.
        // 
        // standard hack: post to the script URL.

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData,
            // mode: 'no-cors' // Use cors if the script handles it, or no-cors if simple fire-and-forget
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return { success: true, result };
    } catch (error) {
        console.error('Error submitting to sheet:', error);
        return { success: false, error: error.message };
    }
};
