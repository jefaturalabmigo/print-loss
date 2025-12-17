/**
 * Service to handle communication with Google Sheets via Google Apps Script Web App
 */

export const submitToGoogleSheet = async (webhookUrl, data) => {
    if (!webhookUrl) return { success: false, error: 'No Webhook URL configured' };

    try {
        // We use no-cors because Google Apps Script Web Apps don't support CORS preflight
        // for opaque requests easily without redirects, but 'no-cors' means we can't read the response.
        // However, usually we can use a simple POST.

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        // Using no-cors mode 'opaquely' sends the request. 
        // We won't know if it succeeded or failed (status is 0), but it prevents the browser CORS block.
        await fetch(webhookUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });

        // Since we can't read the response in no-cors, we assume success if no network error was thrown.
        return { success: true };
    } catch (error) {
        console.error('Error submitting to sheet:', error);
        return { success: false, error: error.message };
    }
};
