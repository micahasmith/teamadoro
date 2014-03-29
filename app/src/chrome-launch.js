/**
 * Created by micah on 2/24/14.
 */
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('../index.html', {
        'bounds': {
            'width': 706,
            'height': 706
        }
    });
});