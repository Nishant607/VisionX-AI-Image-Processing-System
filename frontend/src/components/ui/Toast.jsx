import { renderToStaticMarkup } from 'react-dom/server';
import { toast } from 'react-hot-toast';

// This is essentially just re-exporting toast but ensuring we can use it centrally.
// In App.jsx we already configured the Toaster correctly.
export default toast;
